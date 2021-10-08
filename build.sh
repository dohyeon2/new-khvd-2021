react-scripts build 
if [ -d /var/www/html/build ] 
then 
    sudo rm -r /var/www/html/build 
fi
mv ./build /var/www/html/build
chown ubuntu -R /var/www/html/build