import * as faker from 'faker';
/**
 * Will generate fake ancestor tree data.
 */
export function generateNetworkData() {

    let numOfPeople = 50;
    let numOfFamilies = 10;
    let peoplePerFamily = numOfPeople / numOfFamilies;
    let relationships = ["family", "friend", "associate"];
    let genders = ['M', 'F'];
    let families = [];
    let nodes = [];
    let links = [];

    //Create a person for each family.
    for (let i = 0; i <= numOfFamilies; i++) {
        let family = [];
        for (let j = 0; j < peoplePerFamily; j++) {
            let person = {
                name: faker.name.findName(),
                age: faker.random.number(100),
                gender: faker.random.arrayElement(genders),
                role: family.length === 0 ? 'head' : 'member',
                familyId: i
            }
            family.push(person);
            nodes.push(person)
        }
        families.push(family);
    }

    families.forEach((family, i) => {

        let head = family.find(p => p.role === 'head')
        family.map(person => {
            links.push({
                source: head.name,
                target: person.name
            })
        })

        //Create a link to the next family head.
        let nextFamily = i !== families.length - 1 ? families[i + 1] : families[0];
        let nextFamilyHead = nextFamily.find(p => p.role === 'head');
        links.push({
            source: head.name,
            target: nextFamilyHead.name
        })

        //Create a link to every 2n head.
        if (i % 2 === 0) {
            let next2nFamily = i !== families.length - 1 ? families[i + 2] : families[0];
            let next2nFamilyHead = next2nFamily.find(p => p.role === 'head');
            links.push({
                source: head.name,
                target: next2nFamilyHead.name
            })
        }
    })

    return { nodes, links }
}
