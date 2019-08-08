<h2 align="center"><img src="https://raw.githubusercontent.com/simahao/autocoder/master/images/icon.png" height="128"><br>AutoCoder</h2>
<p align="center"><strong>AutoCoder can generate builder pattern code for java</strong></p>

- [đ´Usage](#%c4%91%c2%9f%c2%8c%c2%b4usage)
- [đŽFeatures](#%c4%91%c2%9f%c2%92%c5%bdfeatures)
- [âď¸Settings](#%c3%a2%c2%9a%c2%99%c4%8f%c2%b8%c2%8fsettings)
- [đ¤ŁRestrictions](#%c4%91%c2%9f%c2%a4%c5%81restrictions)
- [đKnown Issues](#%c4%91%c2%9f%c2%90%c2%9bknown-issues)


## đ´Usage
![How to use](images/usages.gif)

## đŽFeatures
- Generate Builder command: autocoder generate builder pattern code for java bean.
- Menu: if editorFocus is java file,right click mouse,you can run generate command.
- Command: you can input autocoder keyword for triggering generate command.
- Interesting feature: after run generate command,you can add new fields , then run again.

## âď¸Settings
autocoder is so easy, only two settings you should take care.

| Setting          | Description                                             | Type    | Default Value |
| ---------------- | ------------------------------------------------------- | ------- | ------------- |
| autocoder.indent | indent with tab or space                                | String  | space         |
| autocoder.space  | if autocoder.indent=space, you can choose 2\|4\|8 space | Integer | 4             |

## đ¤ŁRestrictions
- regenerate code will delete some code that you added,you should save before running regenerate.

## đKnown Issues
please file issue at [github](https://github.com/simahao/autocoder/issues)

**Enjoy!**
