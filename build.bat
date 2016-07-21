@ECHO OFF
::specify folder path of project
cd BankOpenNodeTsApi/OBPNodeTsApi

::run build commands
CMD /C npm install --save
CMD /C npm run tsc
exit
::exit
Goto :eof