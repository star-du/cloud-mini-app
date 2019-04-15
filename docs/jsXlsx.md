# JS-XSLX 简明文档

Parser and writer for various spreadsheet formats. **Pure-JS** cleanroom implementation from official specifications, related documents, and test files. This is the **community** version. We also offer a pro version with performance enhancements, additional features like styling, and dedicated support.

Js-xlsx conforms to the **Common Spreadsheet Format(CSF)**.

## General Structures
+ **Cell Object**
+ Sheet Objects
    + **Special Sheet Keys**
    + **Worksheet Object**
    + Chartsheet Object
    + Macrosheet Object
    + Dialogsheet Object
+ ** Workbook Object**
    + Workbook File Properties
    + Workbook-Level Attributes
+ Document Features
    + **Formulae**
    + **Column Properties**
    + **Row Properties**
    + Number Formats
    + Hyperlinks
    + Sheet Visibility
    + VBA and Macros

## Cell Object

Cell objects are plain JS objects with keys and values following the convention:

Key | Description
---:| ---------------------------------------------------------------------- 
`v` | raw value (see `Data Types` for more info)
`w` | formatted text (if applicable)
`t` | type: `b` Boolean,`d` Date, `e` Error, `n` Number, `s` Text, `z` Stub
`f` | cell formula encoded as an A1-style string (if applicable)
`F` | range of enclosing array if formula is array formula (if applicable)
`r` | rich text encoding (if applicable)
`h` | HTML rendering of the rich text (if applicable)
`c` | comments associated with the cell
`z` | number format string associated with the cell (if requested)
`l` | cell hyperlink object (`.Target` holds link, `.Tooltip` is tooltip)    
`s` | the style/theme of the cell (if applicable)                            

+ Built-in export utilities(such as CSV exporter) will use the `w` text if it is available. To change a value, be sure to delete `cell.w` (or set it to
`undefined`) before attempting to export.  The utilities will regenerate the `w` text from the number format (`cell.z`) and the raw value if possible.

+ The actual array formula is stored in the `f` field of the first cell in the array range. Other cells in the range will omit the `f` field.

+ The raw value is stored in the `v` value property, interpreted based on the `t` type property. This separation allows for representation of numbers as well as numeric text. There are 6 valid cell types:

Type| Description
---:| ------------------------------------------------------------------
`b` | Boolean: value interpreted as JS `boolean`
`e` | Error: value is a numeric code and `w` property stores common name
`n` | Number: value is a JS `number`
`d` | Date: value is a JS `Date` object or string to be parsed as Date
`s` | Text: value interpreted as JS `string` and written as text
`z` | Stub: blank stub cell that is ignored by data processing utilities

**Error values and interpretation**

Value | Error Meaning
-----:| ----------------
`0x00`| `#NULL!`
`0x07`| `#DIV/0!`
`0x0F`| `#VALUE!`
`0x17`| `#REF!`
`0x1D`| `#NAME?`
`0x24`| `#NUM!`
`0x2A`| `#N/A`
`0x2B`| `#GETTING_DATA`

+ `n` : the Number type

This includes all forms of data that Excel stores as numbers, such as dates/times and Boolean fields. Excel exclusively uses data that can be fit in an IEEE754 floating point number, just like JS Number, so the `v` field holds the raw number. The `w` field holds formatted text. Dates are stored as numbers by default and converted with `XLSX.SSF.parse_date_code`.

+ `d` : the Date type

Generated only when the option `cellDates` is passed. Since JSON does not have a natural Date type, parsers are generally expected to store ISO 8601 Date strings like you would get from `date.toISOString()`. On the other hand, writers and exporters should be able to handle date strings and JS Date objects. Note that Excel disregards timezone modifiers and **treats all dates in the local timezone**. Following Excel, this library treats all dates as relative to local time zone.

By default, Excel stores dates as numbers with a format code that specifies date processing.  For example, the date `19-Feb-17` is stored as the number `42785` with a number format of `d-mmm-yy`. The `SSF` module understands number formats and performs the appropriate conversion. XLSX also supports a special date type `d` where the data is an ISO 8601 date string. The formatter converts the date back to a number. The default behavior for all parsers is to generate number cells. Setting `cellDates` to true will force the generators to store dates.

Excel supports two epochs (January 1 1900 and January 1 1904), see ["1900 vs. 1904 Date System" article](http://support2.microsoft.com/kb/180162). The workbook's epoch can be determined by examining the workbook's `wb.Workbook.WBProps.date1904` property:

```js
    !!((wb.Workbook||{}).WBProps||{}).date1904
```

+ `s` : the String type
Values are explicitly stored as text. Excel will interpret these cells as "number stored as text". Generated Excel files automatically suppress that class of error, but other formats may elicit errors.

+ `z` : blank stub cells.

They are generated in cases where cells have no assigned value but hold comments or other metadata. They are ignored by the core library data processing utility functions. By default these cells are not generated; the parser `sheetStubs` option must be set to `true`.


## Sheet Objects

Each key that does not start with `!` maps to a cell (using `A-1` notation). `sheet[address]` returns the cell object for the specified address.

### Special Sheet Keys

Accessible as `sheet[key]`, each starting with `!`.

+ `sheet['!ref']`: A-1 based range representing the sheet range. Functions that work with sheets should use this parameter to determine the range. Cells that are assigned outside of the range are not processed.  In particular, when writing a sheet by hand, cells outside of the range are not included.

  Functions that handle sheets should test for the presence of `!ref` field. If the `!ref` is omitted or is not a valid range, functions are free to treat
  the sheet as empty or attempt to guess the range. The standard utilities that ship with this library treat sheets as empty (for example, the CSV output is empty string).

  When reading a worksheet with the `sheetRows` property set, the ref parameter
  will use the restricted range.  The original range is set at `ws['!fullref']`

+ `sheet['!margins']`: Object representing the page margins. The default values follow Excel's "normal" preset. Excel also has a "wide" and a "narrow" preset but they are stored as raw measurements.

Key      | (inches)      | "normal" | "wide" |"narrow"
--------:| ------------- |:-------- |:------ |:------
`left`   | left margin   | `0.7`    | `1.0`  | `0.25`
`right`  | right margin  | `0.7`    | `1.0`  | `0.25`
`top`    | top margin    | `0.75`   | `1.0`  | `0.75`
`bottom` | bottom margin | `0.75`   | `1.0`  | `0.75`
`header` | header margin | `0.3`    | `0.5`  | `0.3`
`footer` | footer margin | `0.3`    | `0.5`  | `0.3`

```js
/* Set worksheet sheet to "normal" */
ws["!margins"] = {left:0.7, right:0.7, top:0.75, bottom:0.75, header:0.3, footer:0.3}
/* Set worksheet sheet to "wide" */
ws["!margins"] = {left:1.0, right:1.0, top:1.0, bottom:1.0, header:0.5, footer:0.5}
/* Set worksheet sheet to "narrow" */
ws["!margins"] = {left:0.25, right:0.25, top:0.75, bottom:0.75, header:0.3, footer:0.3}
```

### Worksheet Object

In addition to the base sheet keys, worksheets also add:

+ `ws['!cols']`: array of column properties objects.  Column widths are actually stored in files in a normalized manner, measured in terms of the "Maximum Digit Width" (the largest width of the rendered digits 0-9, in pixels).  When parsed, the column objects store the pixel width in the `wpx` field, character width in the `wch` field, and the maximum digit width in the `MDW` field.

+ `ws['!rows']`: array of row properties objects as explained later in the docs. Each row object encodes properties including row height and visibility.

+ `ws['!merges']`: array of range objects corresponding to the merged cells in the worksheet.  Plain text formats do not support merge cells. CSV export will write all cells in the merge range if they exist, so be sure that only the first cell (upper-left) in the range is set.

+ `ws['!protect']`: object of write sheet protection properties. The `password` key specifies the password for formats that support password-protected sheet (`XLS*`). The writer uses the XOR obfuscation method. The following keys control the sheet protection -- set to `false` to enable a feature when sheet is locked or set to `true` to **disable** a feature:

**Worksheet Protection Details**

Key                   | Feature                | Default   
---------------------:| ---------------------- | ------------
`selectLockedCells`   | Select locked cells    | **enabled**
`selectUnlockedCells` | Select unlocked cells  | **enabled**
`formatCells`         | Format cells           | disabled
`formatColumns`       | Format columns         | disabled
`formatRows`          | Format rows            | disabled
`insertColumns`       | Insert columns         | disabled
`insertRows`          | Insert rows            | disabled
`insertHyperlinks`    | Insert hyperlinks      | disabled
`deleteColumns`       | Delete columns         | disabled
`deleteRows`          | Delete rows            | disabled
`sort`                | Sort                   | disabled
`autoFilter`          | Filter                 | disabled
`pivotTables`         | Use PivotTable reports | disabled
`objects`             | Edit objects           | **enabled**
`scenarios`           | Edit scenarios         | **enabled**

+ `ws['!autofilter']`: AutoFilter object following the schema:

```typescript
type AutoFilter = {
  ref:string; // A-1 based range representing the AutoFilter table range
}
```

### Chartsheet Object

Chartsheets are represented as standard sheets.  They are distinguished with the `!type` property set to `"chart"`. The underlying data and `!ref` refer to the cached data in the chartsheet. The first row of the chartsheet is the underlying header.

### Macrosheet Object

Macrosheets are represented as standard sheets. They are distinguished with the `!type` property set to `"macro"`.

### Dialogsheet Object

Dialogsheets are represented as standard sheets. They are distinguished with the `!type` property set to `"dialog"`.


## Workbook Object

`workbook.SheetNames` is an ordered list of the sheets in the workbook

`wb.Sheets[sheetname]` returns an object representing the worksheet.

`wb.Props` is an object storing the standard properties.  `wb.Custprops` stores
custom properties.  Since the XLS standard properties deviate from the XLSX
standard, XLS parsing stores core properties in both places.

`wb.Workbook` stores workbook-level attributes.

### Workbook File Properties

The various file formats use different internal names for file properties. The
workbook `Props` object normalizes the names:

**File Properties**

JS Name       | Excel Description              
-------------:| -------------------------------
`Title`       | Summary tab "Title"
`Subject`     | Summary tab "Subject"
`Author`      | Summary tab "Author"
`Manager`     | Summary tab "Manager"
`Company`     | Summary tab "Company"
`Category`    | Summary tab "Category"
`Keywords`    | Summary tab "Keywords"
`Comments`    | Summary tab "Comments"
`LastAuthor`  | Statistics tab "Last saved by"
`CreatedDate` | Statistics tab "Created"

For example, to set the workbook title property:

```js
if(!wb.Props) wb.Props = {};
wb.Props.Title = "Insert Title Here";
```

Custom properties are added in the workbook `Custprops` object:

```js
if(!wb.Custprops) wb.Custprops = {};
wb.Custprops["Custom Property"] = "Custom Value";
```

Writers will process the `Props` key of the options object:

```js
/* force the Author to be "SheetJS" */
XLSX.write(wb, {Props:{Author:"SheetJS"}});
```

### Workbook-Level Attributes

+ **Defined Names**

`wb.Workbook.Names` is an array of defined name objects which have the keys:

Key       | Description
---------:| -----------------------------------------------------------------
`Sheet`   | Name scope. Sheet Index (`0` = first sheet) or `null` (Workbook)
`Name`    | Case-sensitive name. Standard rules apply
`Ref`     | A1-style Reference (`"Sheet1!$A$1:$D$20"`)
`Comment` | Comment(only applicable for XLS*)

Excel allows two sheet-scoped defined names to share the same name. However, a sheet-scoped name cannot collide with a workbook-scope name. Workbook writers may not enforce this constraint.

+ Workbook Views

`wb.Workbook.Views` is an array of workbook view objects; key `RTL`: if true, display right-to-left.

+ Miscellaneous Workbook Properties

`wb.Workbook.WBProps` holds other workbook properties:

 Key            | Description
---------------:| --------------------------------------------------
`CodeName`      | VBA Project Workbook Code Name
`date1904`      | epoch: 0/false for 1900 system, 1/true for 1904
`filterPrivacy` | Warn or strip personally identifying info on save


## Document Features

Even for basic features like date storage, the official Excel formats store the same content in different ways. The parsers are expected to convert from the underlying file format representation to the CSF. Writers are expected to convert from CSF back to the underlying file format.

### Formulae

**The A1-style formula** string is stored in the `f` field. Even though different file formats store the formulae in different ways, the formats are translated. CSF formulae do **not** start with `=`.

+ **Representation of A1=1, A2=2, A3=A1+A2**

```js
{
  "!ref": "A1:A3",
  A1: { t:'n', v:1 },
  A2: { t:'n', v:2 },
  A3: { t:'n', v:3, f:'A1+A2' }
}
```

+ Formula without known value

Shared formulae are decompressed and each cell has the formula corresponding to its cell. Writers generally do not attempt to generate shared formulae. Cells with formula entries but no value will be serialized in a way that Excel and other spreadsheet tools will recognize. This library will not automatically compute formula results! For example, to compute `BESSELJ` in a worksheet:

```js
{
  "!ref": "A1:A3",
  A1: { t:'n', v:3.14159 },
  A2: { t:'n', v:2 },
  A3: { t:'n', f:'BESSELJ(A1,A2)' }
}
```

+ **Array Formulae**

Array formulae are stored in the top-left cell of the array block. All cells of an array formula have a `F` field corresponding to the range. A single-cell formula can be distinguished from a plain formula by the presence of `F` field.

For example, setting the cell `C1` to the array formula `{=SUM(A1:A3*B1:B3)}`:

```js
worksheet['C1'] = { t:'n', f: "SUM(A1:A3*B1:B3)", F:"C1:C1" };
```

For a multi-cell array formula, every cell has the same array range but only **the first cell specifies the formula**. Consider `D1:D3=A1:A3*B1:B3`:

```js
worksheet['D1'] = { t:'n', F:"D1:D3", f:"A1:A3*B1:B3" };
worksheet['D2'] = worksheet['D3'] = { t:'n', F:"D1:D3" };
```

Utilities and writers are expected to check for the presence of a `F` field and ignore any possible formula element `f` in cells other than the starting cell. They are not expected to perform validation of the formulae!

+ Formula Output Utility Function

The `sheet_to_formulae` method generates one line per formula or array formula. Array formulae are rendered in the form `range=formula` while plain cells are rendered in the form `cell=formula or value`. Note that string literals are prefixed with an apostrophe `'`, consistent with Excel's formula bar display.

+ **Formulae File Format Details**

Storage Representation | Formats             | Read | Write
----------------------:| ------------------- |:----:|:-----:
A1-style strings       | XLSX                |  o   |  o
RC-style strings       | XLML and plain text |  o   |  o
BIFF Parsed formulae   | XLS*                |  o   |  x
OpenFormula formulae   | ODS/FODS/UOS        |  o   |  o

Since Excel prohibits named cells from colliding with names of `A1` or `RC` style cell references, a (not-so-simple) regex conversion is possible. BIFF Parsed formulae have to be explicitly unwound. OpenFormula formulae can be converted with regular expressions.

### Column Properties

The `!cols` array in each worksheet, if present, is a collection of `ColInfo` objects which have the following properties:

```typescript
type ColInfo = {
  /* visibility */
  hidden?: boolean; // if true, the column is hidden

  /* column width is specified in one of the following ways: */
  wpx?:    number;  // width in screen pixels
  width?:  number;  // width in Excel's "Max Digit Width", width*256 is integral
  wch?:    number;  // width in characters

  /* other fields for preserving features from files */
  MDW?:    number;  // Excel's "Max Digit Width" unit, always integral
};
```

**Implementation details**

Given the constraints, it is possible to determine the MDW without actually inspecting the font!  The parsers guess the pixel width by converting from  idth to pixels and back, repeating for all possible MDW and selecting the MDW that minimizes the error. XLML actually stores the pixel width, so the guess works in the opposite direction. Even though all of the information is made available, writers are expected to follow the priority order:

1) use `width` field if available
2) use `wpx` pixel width if available
3) use `wch` character count if available

### Row Properties

The `!rows` array in each worksheet, if present, is a collection of `RowInfo` objects which have the following properties:

```typescript
type RowInfo = {
  /* visibility */
  hidden?: boolean; // if true, the row is hidden

  /* row height is specified in one of the following ways: */
  hpx?:    number;  // height in screen pixels
  hpt?:    number;  // height in points

  level?:  number;  // 0-indexed outline / group level
};
```

Note: Excel UI displays the base outline level as `1` and the max level as `8`. The `level` field stores the base outline as `0` and the max level as `7`.

**Implementation details**

Excel internally stores row heights in points. The default resolution is 72 DPI or 96 PPI, so the pixel and point size should agree. For different resolutions they may not agree, so the library separates the concepts. Even though all of the information is made available, writers are expected to follow the priority order: 1) `hpx` pixel height if available, 2) `hpt` point height if available


### Number Formats

The `cell.w` formatted text for each cell is produced from `cell.v` and `cell.z` format.  If the format is not specified, the Excel `General` format is used. The format can either be specified as a string or as an index into the format table. Parsers are expected to populate `workbook.SSF` with the number format table. Writers are expected to serialize the table.

Custom tools should ensure that the local table has each used format string somewhere in the table.  Excel convention mandates that the custom formats start at index 164. The following example creates a custom format from scratch:

+ **New worksheet with custom format**

```js
var wb = {
  SheetNames: ["Sheet1"],
  Sheets: {
    Sheet1: {
      "!ref":"A1:C1",
      A1: { t:"n", v:10000 },                    // <- General format
      B1: { t:"n", v:10000, z: "0%" },           // <- Builtin format
      C1: { t:"n", v:10000, z: "\"T\"\ #0.00" }  // <- Custom  format
    }
  }
}
```

The rules are slightly different from how Excel displays custom number formats. In particular, literal characters must be wrapped in double quotes or preceded by a backslash. For more info, see the Excel documentation article `Create or delete a custom number format` or ECMA-376 18.8.31 (Number Formats)

+ **Default Number Formats**

The default formats are listed in `ECMA-376` 18.8.30:

 ID | Format                | ID | Format                     | ID | Format
---:| --------------------- | --:| -------------------------- | --:| ---------------------
 0  | `General`             | 1  | `0`                        | 2  | `0.00`
 3  | `#,##0`               | 4  | `#,##0.00`                 | 9  | `0%`
 10 | `0.00%`               | 11 | `0.00E+00`                 | 12 | `# ?/?`
 13 | `# ??/??`             | 14 | `m/d/yy` [see below]       | 15 | `d-mmm-yy`
 16 | `d-mmm`               | 17 | `mmm-yy`                   | 18 | `h:mm AM/PM`
 19 | `h:mm:ss AM/PM`       | 20 | `h:mm`                     | 21 | `h:mm:ss`
 22 | `m/d/yy h:mm`         | 37 | `#,##0 ;(#,##0)`           | 38 | `#,##0 ;[Red](#,##0)`
 39 | `#,##0.00;(#,##0.00)` | 40 | `#,##0.00;[Red](#,##0.00)` | 45 | `mm:ss`
 46 | `[h]:mm:ss`           | 47 | `mmss.0`                   | 48 | `##0.0E+0`
 49 | `@`

**Format 14 (`m/d/yy`)** is localized by Excel: even though the file specifies that number format, it will be drawn differently based on system settings. To get around this  ambiguity, parse functions accept the `dateNF` option to override the interpretation of that specific format string.

### Hyperlinks

Hyperlinks are stored in the `l` key of cell objects. For example, the following snippet creates a link from cell `A3` to <`http://sheetjs.com`> with the tip `"Find us @ SheetJS.com!"`:

```js
ws['A3'].l = { Target:"http://sheetjs.com", Tooltip:"Find us @ SheetJS.com!" };
```

Note that Excel does not automatically style hyperlinks(displayed as normal text). Links where the target is a cell or range or defined name in the same workbook ("Internal Links") are marked with a leading hash character:

```js
ws['A2'].l = { Target:"#E2" }; /* link to cell E2 */
```

### Sheet Visibility

Excel enables hiding sheets in the lower tab bar. The sheet data is stored in the file but the UI does not readily make it available. Standard hidden sheets are revealed in the "Unhide" menu.  Excel also has "very hidden" sheets which cannot be revealed in the menu. It is **only** accessible in the VB Editor! The visibility setting is stored in the `Hidden` property of sheet props array.

Value | Definition
-----:| ------------
 0    | Visible    
 1    | Hidden     
 2    | Very Hidden

With [sheet_visibility.xlsx](https://rawgit.com/SheetJS/test_files/master/sheet_visibility.xlsx):

```js
> wb.Workbook.Sheets.map(function(x) { return [x.name, x.Hidden] })
[ [ 'Visible', 0 ], [ 'Hidden', 1 ], [ 'VeryHidden', 2 ] ]
```

Non-Excel formats do not support the Very Hidden state. The best way to test if a sheet is visible is to check if the `Hidden` property is logical truth:

```js
> wb.Workbook.Sheets.map(function(x) { return [x.name, !x.Hidden] })
[ [ 'Visible', true ], [ 'Hidden', false ], [ 'VeryHidden', false ] ]
```

### VBA and Macros

VBA Macros are stored in a special data blob that is exposed in the `vbaraw` property of the workbook object when the `bookVBA` option is `true`. They aresupported in `XLSM`, `XLSB`, and `BIFF8 XLS` formats. The supported format writers automatically insert the data blobs if it is present in the workbook and associate with the worksheet names.

+ Custom Code Names

The workbook code name is stored in `wb.Workbook.WBProps.CodeName`. By default, Excel will write `ThisWorkbook` or a translated phrase like `DieseArbeitsmappe`. Worksheet and  chartsheet code names are in the worksheet properties object at `wb.Workbook.Sheets[i].CodeName`. Macrosheets and Dialogsheets are ignored.

The readers and writers preserve the code names, but they have to be manually set when adding a VBA blob to a different workbook.

+ **Macrosheets**

Older versions of Excel also supported a non-VBA "macrosheet" sheet type that stored automation commands. These are exposed in objects with the `!type` property set to `"macro"`.

+ **Detecting macros in workbooks**

The `vbaraw` field will only be set if macros are present, so testing is simple:

```js
function wb_has_macro(wb/*:workbook*/)/*:boolean*/ {
	if(!!wb.vbaraw) return true;
	const sheets = wb.SheetNames.map((n) => wb.Sheets[n]);
	return sheets.some((ws) => !!ws && ws['!type']=='macro');
}
```

## End