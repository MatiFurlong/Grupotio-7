

let form = document.querySelector("#formulario");
let captcha = document.querySelector("#captcha_output");
let captcha_string = "WandaVision";
captcha.innerHTML = captcha_string;


let button = document.querySelector("#button");
button.addEventListener("click", comprobar);
    
   function comprobar(e){
    let input = document.querySelector("#captcha_input").value;

    e.preventDefault();
 
    let formData = new FormData(formulario);
    let Correo = formData.get ('Correo');
    let Nombre = formData.get ('Nombre');
    let Apellido = formData.get ('Apellido');
    let Telefono = formData.get ('Telefono');
    
    if(input == "WandaVision"){
        document.querySelector(".result").innerHTML = "El captcha es correcto";
        console.log (Correo, Nombre, Apellido, Telefono);
    }
    else{
        document.querySelector(".result").innerHTML = "El captcha es incorrecto";
    }

   }
  
  