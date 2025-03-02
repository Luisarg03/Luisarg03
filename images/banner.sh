#!/bin/bash

# Generar el texto con figlet
texto=$(figlet Welcome  !!)

# Definir el logo de una nube con "AWS" y un engranaje dentro
logo='          .-~~~-.
       .-( ⚙ ⚙ ⚙  )_   
    .-(     AWS    )  
   (                 ) 
   |                 |
    `-.___....___..-'

# Dividir el texto y el logo en líneas
mapfile -t lineas_texto <<< "$texto"
mapfile -t lineas_logo <<< "$logo"

# Combinar línea por línea
for i in "${!lineas_texto[@]}"; do
  # Añadir un espacio entre el texto y el logo
  echo -e "\e[36m${lineas_texto[i]}  ${lineas_logo[i]:-}\e[0m"
done