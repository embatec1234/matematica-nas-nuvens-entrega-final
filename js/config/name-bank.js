/* =========================================================
   BANCO DE NOMES
   O jogador NÃO digita o nome: ele escolhe um nome e um sobrenome desta lista.
   Assim não existe nome impróprio, apelido ofensivo nem dado pessoal digitado.

   Para ADICIONAR um nome: coloque-o em FIRST_NAMES (nomes) ou SURNAMES (sobrenomes).
   A lista é ordenada e agrupada por letra automaticamente (veja js/core/names.js).
   Só inclua nomes adequados para crianças.
========================================================= */
const FIRST_NAMES = [
  /* meninas */
  'Agatha','Alana','Alessandra','Alice','Alícia','Amanda','Ana','Ana Beatriz','Ana Clara','Ana Júlia','Ana Laura','Ana Luiza',
  'Anita','Antônia','Aurora','Bárbara','Beatriz','Bela','Bia','Bianca','Bruna','Camila','Carolina','Cecília','Clara','Daniela',
  'Débora','Diana','Duda','Eduarda','Elisa','Eloá','Emanuela','Emanuelly','Emília','Esther','Eva','Fernanda','Flávia','Flora',
  'Gabi','Gabriela','Gabrielly','Giovanna','Heloísa','Helena','Isabel','Isabela','Isabella','Isabelly','Isadora','Ísis','Ivy',
  'Jade','Joana','Júlia','Juliana','Lara','Larissa','Laura','Lavínia','Letícia','Lia','Lívia','Lorena','Luana','Luísa','Luiza',
  'Luna','Maitê','Manuela','Marcela','Maria','Maria Alice','Maria Cecília','Maria Clara','Maria Eduarda','Maria Fernanda',
  'Maria Helena','Maria Júlia','Maria Luiza','Mariana','Marina','Mel','Melissa','Milena','Mirella','Nicole','Nina','Olívia',
  'Paula','Pietra','Priscila','Rafaela','Raquel','Rebeca','Sabrina','Sara','Sarah','Sofia','Sophia','Sophie','Stella','Tainá',
  'Thaís','Valentina','Vitória','Yara','Yasmin','Zoe',
  /* meninos */
  'Alexandre','André','Antônio','Arthur','Augusto','Benício','Benjamin','Bernardo','Breno','Bruno','Caio','Calebe','Carlos',
  'Cauã','Cauê','Daniel','Davi','Davi Lucas','Diego','Douglas','Dudu','Eduardo','Emanuel','Enrico','Enzo','Enzo Gabriel','Erick',
  'Felipe','Fernando','Francisco','Gabriel','Gael','Guilherme','Gustavo','Heitor','Henrique','Hugo','Ian','Igor','Isaac','Ítalo',
  'Joaquim','João','João Gabriel','João Guilherme','João Lucas','João Miguel','João Pedro','Jorge','José','Josué','Kaique','Leandro',
  'Leonardo','Levi','Lorenzo','Lucas','Lucca','Luan','Luiz','Luiz Felipe','Luiz Miguel','Manuel','Marcelo','Marcos','Mateus',
  'Matheus','Miguel','Murilo','Nathan','Nicolas','Noah','Otávio','Paulo','Pedro','Pedro Henrique','Pedro Lucas','Pedro Miguel',
  'Rafael','Raul','Ravi','Renan','Ricardo','Rodrigo','Ruan','Ryan','Samuel','Sérgio','Theo','Thiago','Thomas','Tomás','Ulisses',
  'Vicente','Vinícius','Vitor','Wallace','Wesley','Yago','Yuri',
  /* serve para qualquer criança */
  'Alex','Ariel','Cris'
];

const SURNAMES = [
  'Aguiar','Albuquerque','Alencar','Almeida','Alves','Amaral','Andrade','Araújo','Arruda','Assis','Azevedo','Barbosa','Barreto',
  'Barros','Bastos','Batista','Bento','Bezerra','Borges','Brandão','Brito','Cabral','Câmara','Campos','Cardoso','Carneiro',
  'Carvalho','Castro','Cavalcanti','Chaves','Coelho','Cordeiro','Correia','Costa','Cruz','Dantas','Dias','Domingues','Duarte',
  'Esteves','Farias','Ferrari','Ferreira','Fonseca','Franco','Freire','Freitas','Furtado','Garcia','Gomes','Gonçalves','Gouveia',
  'Guimarães','Haddad','Kobayashi','Lacerda','Leal','Leite','Lima','Lins','Lobo','Lopes','Macedo','Machado','Magalhães',
  'Marques','Martins','Matos','Medeiros','Melo','Mendes','Mendonça','Miranda','Monteiro','Moraes','Moreira','Mota','Moura',
  'Nakamura','Nascimento','Neves','Nogueira','Nunes','Oliveira','Pacheco','Paiva','Pereira','Pinheiro','Prado','Queiroz',
  'Ramos','Rangel','Reis','Rezende','Ribeiro','Rocha','Rodrigues','Rossi','Sampaio','Santana','Santos','Sato','Schmidt',
  'Silva','Silveira','Siqueira','Soares','Souza','Tanaka','Tavares','Teixeira','Torres','Vargas','Ventura','Viana','Vieira',
  'Wagner','Xavier','Yamamoto','Zanetti'
];
