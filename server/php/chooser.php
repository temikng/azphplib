<?php define('CHOOSER_MODE','Y'); 
require __DIR__.'/tabler.php';

if(__FILE__ != TOPLEVEL_FILE) return $functions;

dispatch_template(main_argument(),  main_subarguments());