react-scripts build 
if [ -d /var/www/html/build ] 
then 
    sudo rm -r /var/www/html/build 
fi
mv ./build /var/www/html/build
chown ubuntu -R /var/www/html/build
php /var/www/html/ssr/make_index.php
mkdir /var/www/html/build/backup
mv /var/www/html/build/index.html /var/www/html/build/backup/index.html