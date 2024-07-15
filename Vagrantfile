# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
	config.vm.define "kicker"
	config.vbguest.auto_update = false
	config.vm.box = "bento/debian-12"
	config.vm.hostname = "kicker"

	config.vm.provision "shell", inline: <<~SHELL
		apt-get -yqq update
		apt-get -yqq install dirmngr git
		apt-key adv --recv-keys 1655A0AB68576280
		echo "deb http://deb.nodesource.com/node_21.x buster main" > /etc/apt/sources.list.d/nodejs.list
		apt-get -yqq update
		apt-get -yqq install nodejs
	SHELL

	config.vm.provision "shell", run: "always", inline: <<~SHELL
		mkdir -p /var/www
		mount --bind /vagrant /var/www
	SHELL
	config.vm.network "forwarded_port", guest: 80, host_ip: "127.0.0.1", host: 4242

	config.vm.provision "shell", inline: <<~SHELL
		cd /var/www/api/
		npm install
		npm install pm2 -g
		pm2 startup
		pm2 start kicker --watch
		pm2 save
		apt-get -yqq install nginx-light
		rm -f /var/www/html/index.nginx-debian.html
		rm /etc/nginx/sites-enabled/*
		ln -fst /etc/nginx/sites-available /var/www/etc/nginx/sites-available/kicker.conf
		ln -fst /etc/nginx/sites-enabled/ ../sites-available/kicker.conf
		service nginx restart
	SHELL

	config.vm.provider "virtualbox" do |vb|
		vb.memory = "1024"
	end

end
