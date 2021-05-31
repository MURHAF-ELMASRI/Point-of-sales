# Point of sale system 🛒
**Point of sale system** desktop app uses **electron** <img src="https://user-images.githubusercontent.com/3600593/60781010-41dfae80-a173-11e9-99f9-03a8b712b87d.png" width="30"> with **react** <img src="https://cdn1.iconfinder.com/data/icons/education-set-3-3/74/15-512.png" width="30"> and **sqlite** for local database <img src="https://www.pngkey.com/png/full/853-8535155_sqlite-clipart-sqlite-icon.png" width="20">  .
<br>

# Demo :
If you want to take a look on the app.<br>
you need to install it from [here](<./dist/pos-sys Setup 0.1.0.exe>)

# Use case : 👩‍🔬

- Add Products to the database
- Add Products to the WareHouse
- Record selling process
- support Arabic - English - Turkish **(under development)**
- Dark/Light theme

# Issues 🐛:

* Problem with displaying content in languages other than arabic
* Some fields are missing in turkish language option
* Animation of the circle in warehouse is not quit good

# Improvements :
* Add quantity option when sales process.
* Support extracting bills

# Thoughts:
In this section I am going to explain some choices in the project and why I made it.

## 1  - **Design the database**
When I was designing the database I was trying to answer and solve the following questions:
* User can't add un existing product to the warehouse
* Use can't sale products if they are not in the warehouse
* Product information are saved after entering it the system.

## 2 - **Context bridge**
According to this [#issue](https://github.com/electron/electron/issues/9920#issuecomment-575839738), exposing ***renderer*** to the the main process **ipcMain** put the app on risk especially when you use third party renderer 



