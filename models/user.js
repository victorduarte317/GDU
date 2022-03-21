class User {

    constructor (name, gender, birth, country, email, password, photo, admin){ 

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
}