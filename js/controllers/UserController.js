class UserController {
    constructor() {
        this.addEventBtns();
        this.users = {};
    };

    addLine(user) {
        const tr = document.createElement("tr");
        tr.innerHTML;

    };

    readPhoto(data) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.addEventListener("load", (e) => {
                resolve(fileReader.result);
            });
            fileReader.addEventListener("error", (e)=>{
                reject(e);
            });
            fileReader.readAsDataURL(data);
        })
    };

    register() {
        const formEL = document.querySelector(".register");
        const elements = formEL.elements;
        let registerData = {};
        [...elements].forEach((v) => {
            switch (v.type) {
                case "checkbox":
                    registerData.admin = v.checked;
                    break;
                case "file":
                    break;
                default:
                    registerData[v.name] = v.value;
                    break;
            };
        })
        console.log(registerData);
        let user;
        if (JSON.stringify(this.users) == JSON.stringify({})) {
            user = new User(0,registerData.name,"", registerData.photo, registerData.email, registerData.phone, registerData.admin, registerData.password);
        } else {
            const lastUser = Object.values({
                "a": "teste",
                "b": "teste2"
            })[Object.values({
                "a": "teste",
                "b": "teste2"
            }).length - 1];
            user = new User(lastUser.getId() + 1, registerData.name,"", registerData.photo, registerData.email, registerData.phone, registerData.admin, registerData.password);
        };
        const fileEl = elements.photo;
        if(fileEl.files.length == 0){
            user.setPhoto("img/icon.jpg");
            
        }else{

            this.readPhoto(fileEl.files[0]).then((result)=>{
                user.setPhoto(result);
            },(e)=>{
                console.error(e);
            })
        };
        this.addLine(user);
    };

    addEventBtns() {
        document.querySelector(".add").addEventListener("click", () => {
            document.querySelector(".form-add").style.display = "flex";
        })

        document.querySelectorAll(".close")[0].addEventListener("click", () => {
            document.querySelector(".form-add").style.display = "none";
        })

        document.querySelectorAll(".check")[0].addEventListener("click", () => {
            this.register();
        })

        document.querySelectorAll(".close")[1].addEventListener("click", () => {
            document.querySelector(".form-edit").style.display = "none";
        })
    };
};