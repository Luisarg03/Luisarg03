#!/bin/bash

texto=$(figlet Welcome !)

  logo='          .-~~~-.
       .-(       )_   
    .-(             )  
   (                 ) 
   |                 |
    `-.___....___..-'

mapfile -t lineas_texto <<< "$texto"
mapfile -t lineas_logo <<< "$logo"

for i in "${!lineas_texto[@]}"; do
  echo -e "\e[95m${lineas_texto[i]}    ${lineas_logo[i]:-}\e[0m"
done