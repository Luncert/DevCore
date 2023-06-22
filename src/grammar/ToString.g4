grammar ToString;

data
   : map
   | arr
   | obj
   ;

map
   : '{' mapPair (',' mapPair)* '}'
   | '{' '}'
   ;

mapPair
   : value '=' value?
   ;

arr
   : '[' value (',' value)* ']'
   | '[' ']'
   ;

obj
   : identifier '(' (objPair (',' objPair)* )? ')'
   ;

objPair
   : identifier '=' value?
   ;

identifier
   : LITERAL_VALUE
   ;

value
   : data
   | LITERAL_VALUE
   ;

LITERAL_VALUE
   : LITERAL (LITERAL | TIMEZONE)*
   ;

fragment LITERAL
   : ~ ('(' | ')' | ',' | '[' | ']' | '{' | '}' | '=')
   ;

fragment TIMEZONE
   : '[UTC]'
   ;

WS
   : [ \t\n\r] + -> skip
   ;
