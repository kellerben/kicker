# -*- mode: ruby -*-
# vi: set ft=ruby :

DEVELOPMENT=true

Vagrant.configure("2") do |config|
	config.vm.define "kicker"
	config.vm.box = "bento/debian-9"
	config.vm.hostname = "kicker"

	config.vm.provision "shell", inline: <<~SHELL
		apt-get -yqq update
		apt-get -yqq install dirmngr git
		apt-key adv --recv-keys 1655A0AB68576280
		echo "deb http://deb.nodesource.com/node_8.x stretch main" > /etc/apt/sources.list.d/nodejs.list
		apt-get -yqq update
		apt-get -yqq install nodejs
	SHELL

	if DEVELOPMENT
		config.vm.provision "shell", run: "always", inline: <<~SHELL
			mkdir -p /var/www
			mount --bind /vagrant /var/www
		SHELL
		config.vm.network "forwarded_port", guest: 80, host_ip: "127.0.0.1", host: 4242
	else
		config.vm.provision "shell", inline: <<~SHELL
			mkdir -p /var/www
			cd /var/www
			git clone https://github.com/kellerben/kicker.git
			apt-get -yqq install unattended-upgrades
		SHELL
		config.vm.synced_folder '.', '/vagrant', disabled: true
	end

	config.vm.provision "shell", inline: <<~SHELL
		cd /var/www/
		npm install
		mkdir -p html/include
		ln -fst html/include ../../node_modules/jquery/dist/jquery.min.js
		ln -fst html/include ../../node_modules/nosleep.js/dist/NoSleep.min.js
		npm install pm2 -g
		pm2 startup
		pm2 start kicker #{DEVELOPMENT ? '--watch' : ''}
		pm2 save
		apt-get -yqq install nginx-light
		rm -f /var/www/html/index.nginx-debian.html
		rm /etc/nginx/sites-enabled/*
		ln -fst /etc/nginx/sites-available /var/www/kicker.conf
		ln -fst /etc/nginx/sites-enabled/ ../sites-available/kicker.conf
		service nginx restart
	SHELL

	config.vm.provider "virtualbox" do |vb|
		vb.memory = "1024"
	end

end
