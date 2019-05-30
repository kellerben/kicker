# -*- mode: ruby -*-
# vi: set ft=ruby :

DEVELOPMENT=true

def provisionFile(config, from, to, options={mode: "775"})
	config.vm.provision "file", source: from, destination: "/tmp/#{File.basename(from)}"
	if File.directory?(from)
		config.vm.provision "shell", inline: "cp -a /tmp/#{File.basename(from)} #{to}"
	else
		config.vm.provision "shell", inline: "install --backup=none -m #{options[:mode]} /tmp/#{File.basename(from)} #{to}"
	end
	config.vm.provision "shell", inline: "rm -r /tmp/#{File.basename(from)}"
end

Vagrant.configure("2") do |config|
	config.vm.define "kicker"
	config.vm.box = "bento/debian-9"
	config.vm.hostname = "kicker"
	config.vm.network "forwarded_port", guest: 80, host_ip: "127.0.0.1", host: 4242

	config.vm.provision "shell", inline: "mkdir -p /var/www/ && chmod u+rwX /var/www"
	config.vm.provision "shell", inline: "chmod go-w -R /var/www"
	provisionFile(config, "html","/var/www/")
	provisionFile(config, "kicker","/var/www/")

	config.vm.provision "shell", inline: <<~SHELL
		apt-get -y update
		apt-get -y install dirmngr
		apt-key adv --recv-keys 1655A0AB68576280
		echo "deb http://deb.nodesource.com/node_8.x stretch main" > /etc/apt/sources.list.d/nodejs.list
		apt-get -y update
		apt-get -y install nodejs
		cd /var/www
		npm install ws
		npm install express
		npm install body-parser
		npm install jquery
		ln -fs ../node_modules/jquery/dist/jquery.min.js
		npm install nosleep.js
		ln -fs ../node_modules/nosleep.js/dist/NoSleep.min.js
		npm install winston@next
		npm install pm2 -g
		pm2 startup
		pm2 start kicker
		pm2 save
		apt-get -y install nginx-light
		apt-get -y install unattended-upgrades
	SHELL
	provisionFile(config, "kicker.conf", "/etc/nginx/sites-available", {mode: "664"})
	config.vm.provision "shell", inline: <<~SHELL
		rm /etc/nginx/sites-enabled/default
		ln -s ../sites-available/kicker.conf /etc/nginx/sites-enabled/kicker.conf
		service nginx restart
	SHELL

	config.vm.provider "virtualbox" do |vb|
		vb.memory = "1024"
	end

end
