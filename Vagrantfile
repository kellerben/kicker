# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
	config.vm.define "kicker"
	config.vm.box = "bento/debian-9"
	config.vm.hostname = "kicker"
	config.vm.network "forwarded_port", guest: 80, host_ip: "127.0.0.1", host: 4242

	config.vm.provision "shell", inline: <<~SHELL
		apt-get -y update
		apt-get -y install dirmngr git
		apt-key adv --recv-keys 1655A0AB68576280
		echo "deb http://deb.nodesource.com/node_8.x stretch main" > /etc/apt/sources.list.d/nodejs.list
		apt-get -y update
		apt-get -y install nodejs
		git clone https://github.com/kellerben/kicker.git /var/www
		cd /var/www
		npm install ws
		npm install express
		npm install body-parser
		npm install jquery
		ln -fst html ../node_modules/jquery/dist/jquery.min.js
		npm install nosleep.js
		ln -fst html ../node_modules/nosleep.js/dist/NoSleep.min.js
		npm install winston@next
		npm install pm2 -g
		pm2 startup
		pm2 start kicker
		pm2 save
		apt-get -y install nginx-light
		rm /etc/nginx/sites-enabled/*
		cp kicker.conf /etc/nginx/sites-available
		ln -s ../sites-available/kicker.conf /etc/nginx/sites-enabled/kicker.conf
		service nginx restart
		apt-get -y install unattended-upgrades
	SHELL

	config.vm.provider "virtualbox" do |vb|
		vb.memory = "1024"
	end

end
