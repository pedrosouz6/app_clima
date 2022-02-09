const linkAPI = "http://api.openweathermap.org/data/2.5/weather?";
const infoAPI = "&units=metric&lang=pt_br&appid=";
const keyAPI = "99e4782d1defab3d4e218772725f7506";

//Inputs
const inputCidade = document.querySelector("#cidade");
const buttonEnviar = document.querySelector("#form--btn--enviar");

//Informações para serem preenchidas
const texth2 = document.querySelector(".container--cidade h2");
const diaMes = document.querySelector(".container--day--mes p");
const climaAtual = document.querySelector(".container--clima--atual p");
const climaMax = document.querySelector(".container--clima--max p");
const climaMin = document.querySelector(".container--clima--min p");
const climaNome = document.querySelector(".container--name-clima p");
const imgDinamica = document.querySelector(".container--clima--atual");

//Modal
const modalPrincipal = document.querySelector(".modal--opacidade");
const modalContainer = document.querySelector(".modal--container");
let modalMensagem = document.querySelector(".modal--container--mensagem");

const modalButton = document.querySelector(".modal--container--fechar button");


//Data do sistema do usuario
function dataSistema(){
    const data = new Date();
    let hora = data.getHours();
    let minuto = data.getMinutes();
    let dia = data.getDay();
    let mes = data.getMonth();
    let diadoMes = data.getDate();

    if(hora < 10){
        hora = "0"+hora;
    }

    if(minuto < 10){
        minuto = "0"+minuto;
    }

    //Switch para pegar os nomes(meses e dias)
    switch(mes){
        case 0:
            mes = "Jan";
        break;
        case 1:
            mes = "Fev";
        break;
        case 2:
            mes = "Mar";
        break;
        case 3:
            mes = "Abr";
        break;
        case 4:
            mes = "Mai";
        break;
        case 5:
            mes = "Jun";
        break;
        case 6:
            mes = "Jul";
        break;
        case 7:
            mes = "Ago";
        break;
        case 8:
            mes = "Set";
        break;
        case 9:
            mes = "Out";
        break;
        case 10:
            mes = "Nov";
        break;
        case 11:
            mes = "Dezembro";
        break;

        default: 
            mes = "";
    }

    switch(dia){
        case 0:
            dia = "Dom";
        break;
        case 1:
            dia = "Seg";
        break;
        case 2:
            dia = "Ter";
        break;
        case 3:
            dia = "Qua";
        break;
        case 4:
            dia = "Qui";
        break;
        case 5:
            dia = "Sex";
        break;
        case 6:
            dia = "Sáb";
        break;

        default: 
            dia = "";
    }

    diaMes.innerHTML = `${dia}, ${mes} ${diadoMes}, ${hora}:${minuto}`;
}

//Fechar Modal
function fecharModal(e){
    e.preventDefault();
    modalPrincipal.style.visibility = "hidden";
    modalContainer.style.opacity = "0";
    modalContainer.style.visibility = "hidden";
    inputCidade.focus();
}

//Modal Opacidade
modalPrincipal.addEventListener("click", fecharModal);

//Butão modal
modalButton.addEventListener("click", fecharModal);

//Função validar campos
buttonEnviar.addEventListener("click", (e) => {
    e.preventDefault();

    if(!inputCidade.value){
        modalPrincipal.style.visibility = "visible";
        modalContainer.style.visibility = "visible";
        modalContainer.style.opacity = "1";
        modalMensagem.innerHTML = 
        `
        <p>O campo <span>cidade</span> está vazio!</p>
        <p>Favor, preencher o campo</p>
        `;
    } else {
        acessarAPI();
    }
});

//Acessando API
async function acessarAPI(lat, lon){
    dataSistema();
    const url = await fetch(`${linkAPI}${inputCidade.value.trim() ? 'q='+inputCidade.value.trim() + ',' + 'br' + infoAPI + keyAPI : 'lat='+lat + '&' + 'lon=' + lon + infoAPI + keyAPI}`);
    
    const json = await url.json();

    if(json.hasOwnProperty("cod") && json.hasOwnProperty("message")){
        modalPrincipal.style.visibility = "visible";
        modalContainer.style.visibility = "visible";
        modalContainer.style.opacity = "1";
        modalMensagem.innerHTML = 
        `
        <p>O campo <span>cidade</span> está incorreto!</p>
        <p>Favor, preencher o campo corretamente</p>
        `;
        return
    } else{
        PreencherDados(json);
    }
};

//Preenchendo dados de forma dinâmica
function PreencherDados(dados){
    const tempAtual = dados.main.temp;
    const tempMax = dados.main.temp_max;
    const tempMin = dados.main.temp_min;

    texth2.innerHTML = `${dados.name}`;
    
    climaNome.innerHTML = dados.weather.map(item => item.description);
    climaMax.innerHTML = `${tempMax.toFixed(0)}`;
    climaMin.innerHTML = `${tempMin.toFixed(0)}`;

    ImagemDinamica(tempAtual.toFixed(0));
}

//Imagem de form dinâmica
function ImagemDinamica(temperaturaAtual){
    if(temperaturaAtual <= 22) {
        imgDinamica.innerHTML = `<img src="imagens/nublado.png" alt=""><p> ${temperaturaAtual}° </p>`;
    }

    if(temperaturaAtual >= 23) {
        imgDinamica.innerHTML = `<img src="imagens/pngegg.png" alt=""><p> ${temperaturaAtual}° </p>`;
    }
}

//Pegando a localização do usuario
function localUsuario(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((function(position){
            acessarAPI(position.coords.latitude, position.coords.longitude);
        }))
    }
}

localUsuario();