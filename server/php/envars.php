<?php
/*
*	
*	This file contains default server variables.
*	At the end of file it includes 'env.php' which redefines some of server variables
*
*/

if(!isset($G_P_DOC_ROOT)) {
	$G_P_DOC_ROOT = dirname(dirname(dirname(__DIR__)));
}
$G_PHP_PATH = "$G_P_DOC_ROOT/../../php/php.exe";//find this file, if it doesnt exists, uses 'php' command
$CFG_SUBROOT = '/cfg';
$G_ENV_CACHE_DIR = "$G_P_DOC_ROOT/cache";
$CURRENT_USER_IP = $_SERVER['REMOTE_ADDR'];
$G_ENV_LOAD_MODEL = FALSE;
$G_ENV_LOCAL_USERS  = [
   '/.*/' => "SQL:SELECT rd.enf_rolenamew AS ROLE, CASE r.enf_defaultw WHEN 1 THEN 'D' ELSE 'C' END AS STATUS "
	." FROM enperson_roles r JOIN enpn2persons u ON r.enrel_pnpersonw = u.syrecordidw JOIN eninternal_roles rd ON r.enrel_rolew = rd.syrecordidw"
	." WHERE enf_rolenamew IS NOT NULL AND u.enpnw = ? AND u.enpassw = ?"
	];
$G_ENV_CACHE = 'local';
$G_ENV_CACHE_TTL = '1';
	
$MAGIC_PATH = @$_COOKIE["magic_name"]?"/{$_COOKIE['magic_name']}":'';
$CFG_PATHS = ["$G_P_DOC_ROOT$CFG_SUBROOT$MAGIC_PATH/", "$G_P_DOC_ROOT$CFG_SUBROOT/"];

function get_path($filename, $folder_variants) {
	foreach($folder_variants as $folder) {
		if($folder && file_exists("$folder$filename")) {
			return "$folder$filename";
		}
	}
	$folder_variants = implode(', ',$folder_variants);	
	throw new Exception("Configuration '$filename' not found amongst: $folder_variants");
}

$G_ENV_MAIN_CFG = get_path('db.ini', $CFG_PATHS);
$G_ENV_MODEL = get_path('model.ini', $CFG_PATHS);
$G_ENV_TABLE_DB_MAPPING = get_path('model.map.ini', $CFG_PATHS);
$G_ENV_MODEL_DATA = get_path('model.data.ini', $CFG_PATHS);
$G_ENV_LOCAL_ROLES = get_path('roles.ini', $CFG_PATHS);
$G_ENV_LIB_MAPPING = get_path('lib.map.ini', $CFG_PATHS);
$G_ENV_MFM_USERS = get_path('mfm.users.ini', $CFG_PATHS);

//Register Log In
$RL_CREATE_USER_IN_LINK = 'yes';// 'yes' or 'no'
$RL_CRYPT_KEY = 'D2fq9No8pzsTb12nTx';
//application address
$RL_DIR = 'http://localhost/az/server/php/loginregister/';
$RL_SITEEMAIL = 'redmsmtptst@gmail.com';
// DB constants, also used in http querry
$RL_DBTABLE = 'lr_users';
$RL_EMAIL_CONST = 'email';
$RL_USER_CONST = 'username';
$RL_PASSWORD_CONST = 'password';
$RL_ACTIVE_CONST='active';
$RL_RESET_TOKEN_CONST = 'resetToken';
$RL_RESET_COMPL_CONST = 'resetComplete';
// MSG strings
$RL_REG_MAIL_SUBJ = "Подтверждение регистрации";
$RL_REG_MAIL_HEAD = "Вы успешно зарегистрированы в нашей системе.\n\n Для активации аккаунта пройдите по ссылке:\n\n ";
$RL_REG_MAIL_END = "\n\n С наилучшими пожеланиями. \n\n"; // is it need?!
$RL_RESET_MAIL_SUBJ = "Сброс пароля";
$RL_RESET_MAIL_BODY = "Вы запросили сброс пароля. \n\n Для сброса пройдите по сcылке: ";
$RL_RESET_CHK = "На ваш email была выслана ссылка для сброса пароля.";
$RL_RESET_LOGOK = "Аккаунт активирован, можете войти.";
$RL_RESET_INV_TOKEN = 'Неправильный токен сброса пароля.';
$RL_RESET_ALR_CHANGED = 'Пароль был уже изменен!';
$RL_RESET_CH_OK = "Пароль изменен, можете войти.";
$RL_LOG_WRG = 'Неверный пароль или имя пользователя, или пользователь не активирован.';

@include get_path('env.php', $CFG_PATHS);