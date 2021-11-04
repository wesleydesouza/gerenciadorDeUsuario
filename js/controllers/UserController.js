class UserController {
    constructor(){
        this.addEventBtns();
        this.users = {};
    };

    addLine(user){

    };

    register(){
        const formEL = document.querySelector(".register");
        const elements = formEL.elements;
        let user;
        if(JSON.stringify(this.users) == JSON.stringify({})){
            user = new User(0, elements.name.value, elements.photo.value, elements.email.value, elements.phone.value, elements.admin.value, elements.password.value);
        }else{
            const lastUser = Object.values({"a":"teste", "b":"teste2"})[Object.values({"a":"teste","b":"teste2"}).length-1];
            user = new User(lastUser.getId()+1, elements.name.value, elements.photo.value, elements.email.value, elements.phone.value, elements.admin.value, elements.password.value);
        };
        console.log(user);
    };

    addEventBtns(){
        document.querySelector(".add").addEventListener("click", ()=>{
            document.querySelector(".form-add").style.display = "flex";
        })

        document.querySelectorAll(".close")[0].addEventListener("click", ()=>{
            document.querySelector(".form-add").style.display = "none";
        })

        document.querySelectorAll(".check")[0].addEventListener("click", ()=>{
            this.register();
        })

        document.querySelectorAll(".close")[1].addEventListener("click", ()=>{
            document.querySelector(".form-edit").style.display = "none";
        })
    };
};