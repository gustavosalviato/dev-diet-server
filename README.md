Diet App

## Requisitos Funcionais

 -[x] Dever ser possível criar um usuário
 -[x] Deve ser possível registrar uma refeição feita, com as seguintes informações:
    
    As refeições devem ser relacionadas a um usuário.*
    
    - Nome
    - Descrição
    - Data e Hora
    - Está dentro ou não da dieta

- [x] Deve ser possível editar uma refeição, podendo alterar todos os dados acima
- [x] Deve ser possível apagar uma refeição
- [x] Deve ser possível listar todas as refeições de um usuário
- [x] Deve ser possível visualizar uma única refeição
- [x] Deve ser possível recuperar as métricas de um usuário
  - Quantidade total de refeições registradas
  - Quantidade total de refeições dentro da dieta
  - Quantidade total de refeições fora da dieta
  - Melhor sequência por dia de refeições dentro da dieta
- [x] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou

## Regra de negócio

- [x] Não se pode criar um usuário com o mesmo e-mail usado anteriormente
 - [x] Ao fazer o processo de exclução de um refeição deve se zerar a sequência de dietas dentro da dieta, ou seja dever ser 0
- [x] Quanto efetuado a atualização da um refeição, e a refeição atualizada estiver fora da dieta deve ser zerado a sequência de refeições dentro da dieta
