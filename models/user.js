// manipulaçao de dados

class User {

    constructor (name, gender, birth, country, email, password, photo, admin){ 

        this._id;
        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date();
        //propriedades privadas, encapsuladas
    }

    // get cria métodos pra retornar o valor das variáveis privadas
    // é importante ter métodos get que retornam propriedades por questão de segurança
    // é possível adicionar códigos de condições que serão executados pra controlar o acesso dessas variáveis


    // por exemplo, se alguém digitar no console "console.log(objeto.name)"
    // ao invés do objeto ser mostrado diretamente, o javaScript vai chamar o método get nome() e analisar as restrições e regras contidas no código dele antes de exibí-lo.
    
    // supondo também, que as informações do valor do lado e da altura de um cubo estão armazenadas
    // pra saber a area desse cubo, é possível ter um get que calcule lado * altura e retorne isso quando o objeto area() for chamado
    
    get id() {
        return this._id;
    }

    get register() {
        return this._register;
    }

    get name() {
        return this._name;
    }

    get gender() {
        return this._gender;
    }

    get birth() {
        return this._birth;
    }

    get country() {
        return this._country;
    }

    get email() {
        return this._email;
    }

    get password() {
        return this._password;
    }

    get photo() {
        return this._photo;
    }

    get admin() {
        return this._admin;
    }

    set photo(value) { // O parâmetro aqui é correspondente ao valor que você quer manipular
        this._photo = value; // Aqui, toda vez que o método photo for chamado e receber um valor, esse método vai ser executado

    }

    loadFromJSON(json) {

        for (let name in json) { // pra cada nome encontrado em json faça

            switch(name) {
                case "_register":
                    this[name] = new Date(json[name]);
                break;

                default: 
                    this[name] = json[name];
            }
            

        }

    }


    static getUsersStorage() { // como nao usa this e so retorna, pode ser static

        let users = [];
        
        if (localStorage.getItem("users")) {

            users = JSON.parse(localStorage.getItem("users")); // pega o item "users" de localstorage, trata os dados com o JSON e atribui na variavel
        }
        return users; // retorna variavel tratada
    }


    getNewID() {

        let usersID = parseInt(localStorage.getItem("usersID"));

        if(!usersID > 0) usersID = 0; // se o ID do usuario nao for maior que 0, ele recebe 0

        usersID++; // agora ele vale 1

        localStorage.setItem("usersID", usersID); // fica salvo no localStorage

        return usersID; // é retornado

    }

    saveUser() {

        let users = User.getUsersStorage(); // retorna todos os usuarios que estao no localStorage e cria o array;

        if (this.id > 0) { // no objeto tem um id existente que é maior que 0?

            users.map(u=>{

                if (u._id == this._id) {
                    
                    Object.assign(u, this); // u se refere aos usuarios, this seria o objeto atual, nesse caso, users. u = users
                }

                return u;

            });

        } else {

            // Como eu to dentro da classe, posso manipular o objeto privado _id. Porém, se ele precisasse ser atribuído diretamente, ele precisaria de um setter passando um valor pra ele, assim como foi com o photo.
            this._id = this.getNewID(); // se o id for < 0, ele recebe o id do metodo getNewID();

            users.push(this); // adiciona os dados no final do array. O this referencia ao proprio objeto

        }

        localStorage.setItem("users", JSON.stringify(users));
    }

    remove() {

        let users = User.getUsersStorage(); // pega todo o array de dados

        users.forEach((userData, index)=>{ // forEach recebe dois parametros, os dados que estao sendo passados e a posiçao deles

            if (this._id == userData._id) { // checa se o id encontrado é o id que ta sendo procurado

                users.splice(index, 1); // splice metodo nativo do js vai receber como parametro qual index que vai ser removido e a quantidade de itens, nesse caso, vai excluir 1 item do index "index"

            }

        });

        localStorage.setItem("users", JSON.stringify(users));

    }
}
