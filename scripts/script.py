# -*- coding: utf-8 -*-
import os.path
import json
import urllib
import re
from imgurpython import ImgurClient
from PIL import Image
from slugify import slugify

def getLanguagePart(text, language):
	baliseOpen = "[" + language + "]"
	baliseClose = "[/" + language + "]"
	if(language == "fr") :
		if (baliseOpen not in text) :
			return "Il n'y a pas de traduction pour ce post \n\n" + text
		else :
			firstSplit = text.split(baliseOpen)
			secondSplit = firstSplit[1].split(baliseClose)
			return secondSplit[0]
	else :
		if (baliseOpen not in text) :
			return text
		else :
			firstSplit = text.split(baliseOpen)
			secondSplit = firstSplit[1].split(baliseClose)
			return secondSplit[0]

# Globale variables
client_id = 'cfe367c1454cf1d'
client_secret = 'd9a607f54463ad0960bc29458f003b3cef2657b0'
root_path = '/homez.74/wheelsadrl/www/'
#root_path = '/home/david/Projects/6wheels/'

# Set the api key to use ImgurApidd
client = ImgurClient(client_id, client_secret)

json_posts_lists = {}
json_posts_lists['posts'] = []

# If it doesn't exists, create a new directory for all the posts
if not os.path.exists(root_path + "posts"):
	os.mkdir(root_path + "posts")

# Get all posts id posted by account named JulesGorny
posts = client.get_account_submissions('JulesGorny', page=0)
for post in posts:
	
	# For each post, get all the associated info (full text, images, ..)
	full_post = client.get_album(post.id)
	
	# To make folder name safe, we slugify the title
	slugifiedTitle = slugify(full_post.title[:49])
	
	# Add the current post title to the main json
	json_posts_lists['posts'].append(slugifiedTitle);
	
	# If it doesn't exists, create a new directory for the current post
	if not os.path.exists(root_path + "posts/" + slugifiedTitle):
		os.mkdir(root_path + "posts/" + slugifiedTitle)
		
		print("Retrieving post : " + slugifiedTitle)
		
		# Create and fill the json file for the current post 
		json_post = {}
		json_post['title'] = full_post.title
		json_post['photos_count'] = len(full_post.images)
		json_post['text_fr'] = ''
		json_post['text_en'] = ''
		
		# For each images in the current post
		for i, img in enumerate(full_post.images):
			
			print("Retrieving image and text " + str(i) + " : " + img['link'])
			
			text_fr = ''
			text_en = ''
			if (img['description'] is not None):
				text_fr = getLanguagePart(img['description'].encode('utf-8'), "FR")
				text_en = getLanguagePart(img['description'].encode('utf-8'), "EN")
			
			# On the last post, get the GPS coordinates
			if i == len(full_post.images) - 1:
				
				match = re.search(r'\[.*\,.*\]', text_fr)
				if match:
					coords = match.group().replace('[', '').replace(']', '').strip()
					coords = coords.split(',')
					try:
						float(coords[0])
						float(coords[1])
						json_post['lat'] = coords[0]
						json_post['long'] = coords[1]
						text_fr = text_fr.replace(match.group(), '')
						text_en = text_en.replace(match.group(), '')
					except ValueError:
						print "Error in coordinates format"
				else:
					print "No GPS coordinates in this post"
			
			# Get the associated text and append it to the rest
			json_post['text_fr'] += "\n\n" + text_fr
			json_post['text_en'] += "\n\n" + text_en
				
			# Download the image (named from 1.jpg to n.jpg), and convert it to .png
			temp = img['link'].split('.')
			ext = temp[len(temp)-1]
			imgFullPath = root_path + "posts/" + slugifiedTitle + "/" + str(i) + "." + ext
			try:
				urllib.urlretrieve(img['link'], imgFullPath)
			except Exception,e:
				print e
				continue # continue to next row
				
			im = Image.open(imgFullPath)
			newImgFullPath = imgFullPath.replace("." + ext, ".png")
			os.remove(imgFullPath)
			im.save(newImgFullPath)
			
			# Create a thumbnail version of this image
			im = Image.open(newImgFullPath)
			imgW = im.size[0]
			imgH = im.size[1]
			if (imgW > imgH):
				newW = int((276.0/imgH)*imgW)
				newH = 276
				thumbnail = im.resize((newW, newH), Image.ANTIALIAS)
				if (newW > 368):
					delta = newW - 368
					left = int(delta/2)
					upper = 0
					right = newW - int(delta/2)
					lower = 276
					thumbnail = thumbnail.crop((left, upper, right, lower))
			else:
				newW = 368
				newH = int((368.0/imgW)*imgH)
				thumbnail = im.resize((newW, newH), Image.ANTIALIAS)
				if (newH > 276):
					delta = newH - 276
					left = 0
					upper = int(delta/2)
					right = 368
					lower = newH - int(delta/2)
					thumbnail = thumbnail.crop((left, upper, right, lower))
				
			thumbnail.save(root_path + "posts/" + slugifiedTitle + "/" + str(i) + "_small.png", "PNG", quality = 90)
			
			# Save the json file of the post
			post_file = open(root_path + "posts/" + slugifiedTitle + "/content.json", "w+")
			json.dump(json_post, post_file)
			post_file.close()
		
# Write the posts list titles on a general json
posts_lists_file = open(root_path + "posts/" + "posts_lists.json","w+")
json.dump(json_posts_lists, posts_lists_file)
posts_lists_file.close()
