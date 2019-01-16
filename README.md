<p align="center"><strong>AutoCoder can generate setter,getter or builder code for java</strong></p>

- [🌴 Usage](#%F0%9F%8C%B4-usage)
- [💮 Features](#%F0%9F%92%AE-features)
- [⚙️ Settings](#%E2%9A%99%EF%B8%8F-settings)
- [🤣 Restrictions](#%F0%9F%A4%A3-restrictions)
- [🐛 Known Issues](#%F0%9F%90%9B-known-issues)
## 🌴 Usage
![How to use](images/usages.gif)
## 💮 Features
- Generate All command:autocoder generate setter,getter and toString method for java bean.
- Generate Setter And Getter command:autocoder generate setter and getter method for java bean.
- Generate Builder command:autocoder generate builder code for java bean.
- menu:If editorFocus is java file,right click mouse,you can run generate command with menu.
- command:You can input autocoder keyword for triggering generate command.
- Interesting feature:after run generate command,you can add new fields after the last field of java file, then you can run Generate command.
## ⚙️ Settings
autocoder is so easy, only two settings you should take care.
|Setting|Description|Type|Default Value|
|---|---|---|---|
|autocoder.indent|indent with tab or space|String|tab|
|autocoder.space|if autocoder.indent=space, you can choose 2\|4\|8 space|Integer|4|
## 🤣 Restrictions
- After run Generate Builder command, you can not run Generate All or Generate Setter and Getter again.You can delete code except java fields, run Generate All or Generate Setter and Getter again.
- After run Generate All or Generate Setter and Getter command, you cann't run Generate Builder command.You can delete code except java fields, run Generate Builder again. 
- regenerate code will delete some code,you should save before running regenerate.

## 🐛 Known Issues
please file issue at [github](https://github.com/simahao/autocoder/issues)

**Enjoy!**
