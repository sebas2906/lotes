let modal = new bootstrap.Modal(document.getElementById('modal'))
let loading_modal = new bootstrap.Modal(document.getElementById('modal-loading'))
let modal_title=document.getElementById('modal-title');
let modal_body=document.getElementById('modal-body');
let modal_price=document.getElementById('modal-price');
let modal_mt=document.getElementById('modal-mt');
let modal_mt_cons=document.getElementById('modal-mt-cons');
let modal_status=document.getElementById('modal-status');

loading_modal.show();

if(!detectMob()){
    let panZoomTiger = svgPanZoom('#Capa_1',{
    zoomEnabled: true,
    controlIconsEnabled: true,
    fit: true,
    center: true,
    minZoom: 0.1
  });
}

init().then(token => {
    loading_modal.hide();
    let buttons = document.getElementsByTagName('a');
    console.log(buttons);
    let arr = Array.prototype.slice.call(buttons);
    console.log(arr);
    (Array.prototype.slice.call(buttons)).forEach(button => {
        button.addEventListener('click', () => {
          //  modal.toggle();
          //  return;
          loading_modal.show();
            console.log(button.id);
            let [code, number] = [(button.id).split('-')[0], (button.id).split('-')[1]];
            if (number == 'btn') {
                return;
            }
            console.log(`${code} ${number}`);
            getPlaceInfo(token, code, number).then(resp => {
                console.log(resp);
                let info=resp.datos[0];
                let obj={
                    title:`Lote ${code}-${number}`,
                    state:info.estado,
                    mt_terrain:info.mtTerreno,
                    mt_construction:info.mtConstruido,
                    price:info.precio
                }
                console.log(obj);
                modal_title.innerText=obj.title;
                modal_price.innerText='$'+(milliFormat(4000));
                modal_status.innerHTML=obj.state=='Disponible'?`<span class="badge rounded-pill bg-success">${obj.state}</span>`:`<span class="badge rounded-pill bg-danger">${obj.state}</span>`;
                modal_mt.innerText=obj.mt_terrain+' mts';
                modal_mt_cons.innerText=obj.mt_construction+' mts';
                loading_modal.hide();
                modal.toggle();
            })
        })
    });
});

function detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];
    
    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}


function milliFormat (num) {// Agregar miles
	s=num.toString()
	if(/[^0-9\.]/.test(s)) return "invalid value";
	s=s.replace(/^(\d*)$/,"$1.");
	//s=(s+"00").replace(/(\d*\.\d\d)\d*/,"$1");
	s=s.replace(".",",");
	var re=/(\d)(\d{3},)/;
	while(re.test(s)){
		s=s.replace(re,"$1,$2");
	}
	s=s.replace(/,(\d\d)$/,".$1");
    s=s.replace(/^\./,"0.");
    s=s.replace(',','.');
    s=s.replace(',','');
	return s;
}


async function getPlaceInfo(token, code, number) {
    const post_body = {
        company: "EDINSON",
        key: "",
        nameFunction: "BUSCARVIPRODET",
        parametersList: [{
                PName: "Cliente",
                PValue: "EDINSON"
            },
            {
                PName: "Empresa",
                PValue: "EDINSON"
            },
            {
                PName: "Proyecto",
                PValue: "PALMERAS 2"
            },
            {
                PName: "Codprod",
                PValue: ""
            },
            {
                PName: "Ubicacion",
                PValue: `Mza ${code} Lt ${number}`
            }
        ]
    }

    const response = await fetch("https://appauranet.com/APIAURANETB2B/api/Data/AuranetApiGDJ", {
        method: "POST",
        body: JSON.stringify(post_body),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
    }
    console.log("Request successful!")
    return response.json();
}

async function getTocken() {
    const post_body = {
        Cliente: "EDINSON",
        Empresa: "EDINSON",
        Origen: "GENERAL",
        idkey: "17"
    }

    const response = await fetch("https://appauranet.com/APIAURANETB2B/api/Login/Token", {
        method: "POST",
        body: JSON.stringify(post_body),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic ZVp5ZFdMb2F2WWVZMUxzcGVLa0lQNkhSbVVMMHZSZzI6aFplSWdzUDJNSW5jbnRxclpOTDJPZ1JrUE8wdFdieEs="
        }
    })

    if (!response.ok) {
        throw new Error(`Request failed with status ${reponse.status}`)
    }
    console.log("Request successful! ");
    return response.json();
}

async function init() {
    let token = await getTocken();
    token = token;
    console.log(token)
    let c = await getPlaceInfo(token.dato);
    console.log(c)
    return token.dato;
}