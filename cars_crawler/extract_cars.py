# #############################################################################
# Extracts a list of dicts {brand_name:  [list_of_models]} from a web resource
# and pushes all into firebase
# #############################################################################

import urllib
from bs4 import BeautifulSoup
import pyrebase

page = urllib.urlopen('http://www.automobile.it/marche-modelli').read()
soup = BeautifulSoup(page, 'html.parser')

boxes = soup.find_all("div", class_="se-box--vertical")

cars = [ {b.contents[1].text.strip().replace("~", ""):
            [m.text.strip().replace("~", "") for m in
                [c for c in b.contents[3].find_all("a")] ]} for b in boxes[1:-1]]

print("Cars loaded, pushing to Firebase")

### Imports all in Firebase


config = {
  "apiKey": "AIzaSyA_1_h0pf6c-nie41ct-rE1oQ5g-TKH-zU",
  "authDomain": "todo-94247.firebaseapp.com",
  "databaseURL": "https://todo-94247.firebaseio.com",
  "projectId": "todo-94247",
  "storageBucket": "todo-94247.appspot.com",
  "messagingSenderId": "305703722979"
}

firebase = pyrebase.initialize_app(config)

# Get a reference to the database service
db = firebase.database()
# res = [db.child("automotive/cars").push(c) for c in cars]

res = [db.child("automotive/cars/" + str(c.keys()[0].encode('utf-8')) ).push( c[c.keys()[0]] ) for c in cars]

print("Data pushed: ", res)
