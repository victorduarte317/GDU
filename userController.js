class UserController {

    constructor (formId, tableId){

        this.formEl = document.getElementById(formId); 
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();

    }

    onSubmit(){ // Método que vai ser executado no evento submit

        this.formEl.addEventListener("submit", event => { // Adicionando um listener do evento submit ao formulário via elemento formEl

            event.preventDefault(); // Prevenindo a ação padrão de tratamento de evento da pagina

            let btn = this.formEl.querySelector("[type=submit]"); // Armazena o tipo do botão do formulário na variável local btn

            btn.disabled = true; 

            let values = this.getValues(); // a variável local values vai receber o getValues

            if (!values) return false; 
            // como values agora é booleano por conta da checagem feita antes do retorno de new Users, não é possivel atribuir "content" em value.photo, já que value agora é booleano.
            // então, essa verificação diz que, se values for falso, já retorna falso e para a execução do formulário.

            this.getPhoto().then(

                (content)=> { 
                    // Aqui ele vai receber o content, que na verdade é o resultado do resolve.
                    // Quando der certo, a função vai ser executada.

                    values.photo = content;

                    this.addLine(values);

                    this.formEl.reset(); // Usa o () pro método ser executado

                    btn.disabled = false;

                    // Adicionando a linha criada e atribuindo os valores chamando o getValues                     
                    // o addLine vem pra cá já que ele só vai adicionar a linha depois que tudo estiver pronto

                }, 
                
                function(e){ // Como o "this" não está sendo usado aqui, vou manter a function mesmo
                    // Quando der errado, essa função vai ser executada
                    // Ela recebe o evento "e" do reject

                    console.error(e);
              
                }


            );
        
        });

    }

    getPhoto() {
        //return new Promise (function(resolve, reject)) dava erro já que o escopo do "this.formEl" passava a ser local, só da função. Então, pra resolver, é só usar a arrow function, o this vai voltar a existir no contexto.
        return new Promise((resolve, reject)=>{  // Retorna uma promise (classe) por meio de uma arrow function que recebe dois parâmetros. Se der certo, executa o resolve. Se der errado, o reject.

            let fileReader = new FileReader(); // No uso do comando, o construtor já é chamado

            let elements = [...this.formEl.elements].filter(item=>{ 
            // Como eu quero só elemento do campo da foto, usa-se o método filter pra filtrar o array, ele recebe cada item e checa se é uma foto.
            // elements vai receber o array já filtrado

            if (item.name === 'photo') { 
                return item;
            }
        });

        let file = elements[0].files[0]; 
        // Como os elementos são um array e são uma coleção HTML, eu quero só o primeiro elemento e só o primeiro arquivo desse elemento.
        // Como o codigo acima vai retornar um caminho pra imagem, esse caminho pode ser usado pelo fileReader.
        // Então, pra facilitar, os valores foram atribuidos a variavel file e ela vai ser manipulada pelo fileReader.

        fileReader.onload = () => {  
        // No carregar da imagem executa a função de callback, que seria uma função de retorno. Ou seja, quando terminar de executar o onLoad() (quando terminar de carregar a foto) executa a função de callback.

            resolve(fileReader.result); 
            // Aqui vai retornar o conteúdo que vai ser usado como URL da IMG(?)
            // Esse result vai cair no "content" la em cima
        };

        fileReader.onerror = (e)=> { // Quando o evento disparado der erro
            
            reject(e); // Rejeita o evento

        };
            
            if (file) { // Se o usuário inserir um arquivo de foto
                fileReader.readAsDataURL(file);
        
            } else {
                resolve('dist/img/boxed-bg.jpg'); // Precisa ser resolve pra inserção de arquivo não ser obrigatória, e se o usuário não colocar um arquivo, atribui-se a imagem que implica que o usuário não tem foto.
            }

        });

        
    }

    getValues(){ // Método pra pegar os valores inseridos

        let user = {}; // Cria um array local
        let isValid = true; // VAlor padrão da verificação da validade do formulário

        // this.formEl.elements.forEach(function(field, index){ Esse código dava erro, já que o forEach não identificou um array.
        // Pra resolver, o this.formEl.elements foi transformado em um array. 
        // Porém, mesmo transformado em array, ainda precisaria especificar qual index deve ser percorrido, colocando o this.formEl.elements[1], this.formEl.elements[2] etc...
        // Então, o operador spread foi utilizado, com o [...this], fazendo com que não seja precisa essa especificação.

        [...this.formEl.elements].forEach(function(field, index) { // Percorre cada campo e cada posição (index) do formulário
        
        if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) { // se o index dos campos obrigatórios for >-1 e o valor do campo não for vazio

            // console.dir(field) vai acessar esse campo como se fosse um objeto. Explorando o console, é possível achar o elemento pai dele, em parentElement.
            // também vai dar pra ver a coleção desse campo em classList. Dentro dessa coleção, existem métodos, e um deles é o add. Então, isso significa que eu posso adicionar uma classe nele.
            // visando o reforço da obrigatoriedade de preenchimento dos campos, podemos acrescentar a classe externa 'has-error' do adminLTE, aplicação usada pra criar o layout do site.

            field.parentElement.classList.add('has-error');
            isValid = false;

            // basicamente, se a condiçao caiu em um dos campos requeridos no array e o valor tá vazio, para a execução do formulário
            

        }

            if (field.name === "gender") { // Se for o campo gender
    
                if (field.checked) { // E se o campo estiver selecionado
                    user[field.name] = field.value;  // O nome do campo no array vai receber o valor do campo
                }

                } else if(field.name == "admin") { // Se for o campo admin

                    user[field.name] = field.checked; // Vai checar e retornar true se tiver checkado e false se não tiver checkado.

                } else {

                    user[field.name] = field.value;
                }
            });

            if (!isValid) { // Vai verificar se, mesmo depois da verificação acima, o isValid ainda é falso
                return false; // Vai agir como um break e parar a execução do formulário
            }
    
        return new User( // Retorna as informações e atribui os valores aos campos do formulario
            user.name, 
            user.gender, 
            user.birth, 
            user.country, 
            user.email, 
            user.password, 
            user.photo, 
            user.admin
        );

    }

    
    addLine(dataUser) { // Método pra adicionar uma linha na página

        let tr = document.createElement('tr');

        tr.dataset.user = JSON.stringify(dataUser); 
        // O método stringify do JSON tá serializando - ou seja, transformando o objeto em texto sem que ele perca suas propriedades - o dataUser, já que o dataset, por padrão, converte tudo pra string e essa conversão faz o objeto perder as propriedades.
        
        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
    `;
        
        // if ternário na linha 144: Se for admin, então escreve "sim" e se não for, escreve "não".
        // if ternário é usado quando existem poucas validações, de preferência duas.
        // innerHTML vai interpretar os comandos dentro da template string e executá-los, adicionando efetivamente uma nova tabela no HTML.
        // Utils.dateFormat(dataUser.register) tá passando uma classe.métodoestático e o dataUser.register tá sendo passado como parâmetro e sendo tratado dentro da classe Utils.
        this.tableEl.appendChild(tr);  
        //appendChild vai fazer com que tudo que esteja sendo interpretado dentro de innerHTML seja filho da tag "tr", adicionando várias linhas na pagina.

        this.updateCount();

    } 

    updateCount() { // Método pra trackear a contagem de atualizações no número de administradores/usuarios
        let numUsers = 0;
        let numAdmins = 0;
        
        [...this.tableEl.children].forEach(tr=>{ // o children é o campo que contém os elementos necessarios para que ocorra uma verificaçao linha por linha pra descobrir o numero de admin/clientes
        
            numUsers++; // adiciona +1 no numero de usuarios
            let user = JSON.parse(tr.dataset.user) // a variavel user vai receber a interpretação de tr.dataset.user, recebendo as propriedades de objeto de volta

            if (user._admin) numAdmins++; // se o usuário for um admin, adiciona +1 no numero de admns
        }); 
    
        document.querySelector("#number-users").innerHTML = numUsers; 
        document.querySelector("#number-users-admin").innerHTML = numAdmins;

        // busca o elemento que vai receber a adição do usuario no html, usa o .innerHTML pra alterar o valor e recebe o valor correspndente.
    
    }
}