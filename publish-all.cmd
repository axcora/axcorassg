@echo off
cd src\components\package
for /D %%F in (*) do (
    cd "%%F"
    echo Publishing %%F ...
    npm publish --access public
    cd ..
)
