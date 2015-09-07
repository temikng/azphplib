rem @echo off
set _r_pth=%cd%/
set _rt_pth=%_r_pth:\=/%
IF EXIST httpd.conf (
	del httpd.conf
)
echo #httpd.conf file autogenerated by make-httpd-conf.cmd >> httpd.conf
rem add settings contain paths
echo ServerRoot "%_rt_pth%apache" >> httpd.conf
echo LoadFile "%_rt_pth%php/ext/pg-libs/libpq.dll"
echo LoadModule php5_module "%_rt_pth%php/php5apache2_2.dll" >> httpd.conf
echo PHPIniDir "%_rt_pth%php" >> httpd.conf
echo DocumentRoot "%_rt_pth%html" >> httpd.conf
echo ^<Directory "%_rt_pth%html"^> >> httpd.conf
echo    Options Indexes FollowSymLinks >> httpd.conf
echo    AllowOverride None >> httpd.conf
echo    Order allow,deny >> httpd.conf
echo    Allow from all >> httpd.conf
echo ^</Directory^> >> httpd.conf
echo ^<IfModule alias_module^> >> httpd.conf
echo     ScriptAlias /cgi-bin/ "%_rt_pth%apache/cgi-bin/" >> httpd.conf
echo ^</IfModule^> >> httpd.conf
echo ^<Directory "%_rt_pth%apache/cgi-bin"^> >> httpd.conf
echo     AllowOverride None >> httpd.conf
echo     Options None >> httpd.conf
echo     Order allow,deny >> httpd.conf
echo     Allow from all >> httpd.conf
echo ^</Directory^> >> httpd.conf
rem add settings without directory paths
type %cd%\cfg\apache-nopaths.conf >> httpd.conf
move /Y httpd.conf %cd%\apache\conf\httpd.conf


