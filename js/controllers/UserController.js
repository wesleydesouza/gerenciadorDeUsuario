class UserController {
    constructor() {
        this.addEventBtns();
        this.users = {};
    };

    verifEmail(user){
        let verifEmail = Object.values(this.users).filter(v => {
            let user2 = new User(v._id,v._name,v._photo,v._email,v._phone,v._admin,v._password);

            if(user2.getEmail() == user.getEmail() && user2.getId() != user.getId()){
                return v;
            };
        })
        if(verifEmail.length > 0){
            return false;
        }else{
            return true;
        };
    };

    closeForm(form, formContainer){
        form.reset();
        formContainer.style.display = "none";
    };

    attRows(tr,user){
        tr.datauser.user = JSON.stringify(user);
        tr.querySelector(".table-icon img").src = user.getPhoto();
        tr.querySelector(".table-name").innerHTML = user.getName();
        tr.querySelector(".table-email").innerHTML = user.getEmail();
        tr.querySelector(".table-phone").innerHTML = user.getPhone();
        if(user.getAdmin()){
            tr.querySelector(".table-admin").innerHTML = "Sim";
        }else{
            tr.querySelector(".table-admin").innerHTML = "Não";
        };
    };

    edit(){
        const formEl = document.querySelector("form.edit");
        const elements = formEl.elements;

        let selectedUser = [...document.querySelectorAll(".users tr:not(:first-child)")].filter(v =>{
            if(JSON.parse(v.dataset.user)._id == elements.id.value){
                return v;
            };
        })

        let userObj = JSON.parse(selectedUser[0].dataset.user);
        userObj._name = elements.name.value;
        userObj._email = elements.email.value;
        userObj._phone = elements.phone.value;
        userObj._admin = elements.admin.checked;
        let user = new User(userObj._id, userObj._name, "", userObj._email, userObj._phone, userObj._admin, userObj._password);

        if(!this.verifEmail(user)){
            alert("E-mail já cadastrado.");
            return;
        };

        let files = elements.photo.files;
        if(files.length == 0){
            user.setPhoto(userObj._photo);
            this.attUsers(user.getId(), user);
            this.attRows(selectedUser[0], user);
            this.closeForm(document.querySelector("form.edit"), document.querySelector(".form-edit"));
            this.attLoginData();
            
            if(this.login.getId() == user.getId() && this.login.getEmail() != user.getEmail() || user.getAdmin() == false){
                alert("Seus dados foram alterados, faça o login novamente!");
                this.logout();
            };
        }else{
            this.readPhoto(files[0]).then(result => {
                user.setPhoto(result);
                this.attUsers(user.getId(), user);
                this.attRows(selectedUser[0], user);
                this.closeForm(document.querySelector("form.edit"), document.querySelector(".form-edit"));
                this.attLoginData();
                
                if(this.login.getId() == user.getId() && this.login.getEmail() != user.getEmail() || user.getAdmin() == false){
                    alert("Seus dados foram alterados, faça o login novamente!");
                    this.logout();
                };
            },e => {
                console.error(e);
            })
        };
    };
    

    logout(){
        sessionStorage.removeItem("login");
        window.location.href = "login.html";
    };

    addLine(user) {
        let tr = document.createElement("tr");
        tr.innerHTML = `
        <td class="table-icon">${user.getId()}</td>
        <td class="table-icon"><img src='${user.getPhoto()}' alt="Ícone"</td>
        <td class="table-name">${user.getName()}</td>
        <td class="table-email">${user.getEmail()}</td>
        <td class="table-phone">${user.getPhone()}</td>
        <td class="table-date">${user.getDate()}</td>`;
        if(user.getAdmin()){
            tr.innerHTML+=`<td class="table-admin">Sim</td>`
        }else{
            tr.innerHTML+=`<td class="table-admin">Não</td>`
        };
        tr.innerHTML+=`
        <td class="table-actions">
            <span class="material-icons-sharp edit-btn">edit</span>
            <span class="material-icons-sharp delete-btn">delete</span>
        </td>`;
       let tbody = document.querySelector(".users tbody").appendChild(tr);
    };

    readPhoto(data) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.addEventListener("load", () => {
                resolve(fileReader.result);
            });
            fileReader.addEventListener("error", (e)=>{
                reject(e);
            });
            fileReader.readAsDataURL(data);
        })
    };

    attUsers(key, value){
        this.users[key] = value;
        localStorage.setItem("users", JSON.stringify(this.users));
    };

    register() {
        const formEL = document.querySelector(".register");
        const elements = formEL.elements;
        let user;
        let registerData = {};
        [...elements].forEach(v => {
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
        if (JSON.stringify(this.users) == JSON.stringify({})) {
            user = new User(0,registerData.name,"",registerData.email, registerData.phone, registerData.admin, registerData.password);
        } else {
            const lastUser = Object.values(this.users)[Object.values(this.users).length - 1];
            user = new User(lastUser.getId() + 1, registerData.name,"",registerData.email, registerData.phone, registerData.admin, registerData.password);
        };
        const fileEl = elements.photo;
        if(fileEl.files.length == 0){
            user.setPhoto("img/icon.jpg");
            this.users[user.getId()] = user;
            this.addLine(user);
            this.closeForm(document.querySelector("form.register"), document.querySelector(".form-add"));
        }else{

            this.readPhoto(fileEl.files[0]).then((result)=>{
                user.setPhoto(result);
                this.users[user.getId()] = user;
                this.addLine(user);
                this.closeForm(document.querySelector("form.register"), document.querySelector(".form-add"));
            },(e)=>{
                console.error(e);
            })
        };
    };

    addEventBtns() {
        document.querySelector(".add").addEventListener("click", () => {
            document.querySelector(".form-add").style.display = "flex";
        })

        document.querySelectorAll(".close")[0].addEventListener("click", () => {
            this.closeForm(document.querySelector("form.register"), document.querySelector(".form-add"));
            document.querySelector(".form-add").style.display = "none";
        })

        document.querySelectorAll(".check")[0].addEventListener("click", () => {
            this.register();
        })

        document.querySelectorAll(".close")[1].addEventListener("click", () => {
            this.closeForm(document.querySelector(".form.edit"), document.querySelector(".form-edit"));
            document.querySelector(".form-edit").style.display = "none";
        })
        document.querySelectorAll(".check")[1].addEventListener("click", () => {
            this.edit();
        })

        document.querySelector('.logout').addEventListener('click',()=>{
            this.logout();
        })
    };
};