# CSV to Docx Generator

This tool was originally made for the credentials committee of DFL Senate District 66, so we can print out the labels for badges at our convention. However this can be used for a whole lot more, so I'm working on generalizing it for anyone to use.

## How it works

Each line in the comma seperated value (CSV) file will be filled into the template file. Placeholders in the template files should be in the format: <code>{ROW_NUMBER:NAME}</code> (Ex, <code>{0:FN}</code>).The row number should start at <code>0</code> and increase. The field “number of items” should be set to the highest value of ROW_NUMBER in the placeholders in the template. If your CSV has more rows than the number of items in your template, the generator will produce another file, filling in the placeholders from where it left off begining on row number <code>0</code>. The generator will then compress all the documents into a Zip file and automatically begin downloading them. <em>All files selected on this page are never sent to a server; they are processed locally in your browser.
