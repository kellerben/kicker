# -*- mode: ruby -*-
# vi: set ft=ruby :

def provisionFile(config, from, to, options={mode: "775"})
	config.vm.provision "file", source: from, destination: "/tmp/#{File.basename(from)}"
	config.vm.provision "shell", inline: "install -m #{options[:mode]} /tmp/#{File.basename(from)} #{to}"
end

Vagrant.configure("2") do |config|
	config.vm.define "kicker"
	config.vm.box = "mgmsp/debian-minimal"
	config.vm.hostname = "kicker"
	config.vm.box_url = "https://sp-vm-repo.mgm-edv.de/vagrant/debian-minimal.json"

	config.vm.provision "shell", inline: "mkdir -p /var/www/ && chmod u+rwX /var/www"
	config.vm.provision "shell", inline: "chmod go-w -R /var/www"
	provisionFile(config, "html","/var/www/")
	provisionFile(config, "kicker","/var/www/")

	config.vm.provision "shell", inline: <<~SHELL
		apt-key adv --recv-keys 1655A0AB68576280
		echo "deb http://deb.nodesource.com/node_8.x stretch main" > /etc/apt/sources.list.d/nodejs.list
		apt-get -y update
		apt-get -y install nodejs
		cd /var/www
		npm install ws
		npm install express
		npm install body-parser
		npm install jquery
		ln -s ../node_modules/jquery/dist/jquery.min.js /var/www/html/
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
