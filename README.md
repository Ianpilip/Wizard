Lets suppose that we need to make a wizard, which will lead us through several steps to create an hierarchical structure like this

Ultimate goal
1. Strategic goal 1   
1.1. Operational goal 1   
1.2. Operational goal 2   
1.3. Operational goal 3   
2. Strategic goal 2   
2.1. Operational goal 1   
2.2. Operational goal 2

And we need to make it strict For example,
* You have created an ultimate goal
* Then you have created the first Strategic goal
* Then 3 Operational goals
* Then the first Operational goal
* If you decided to change the name of the first Strategic goal, you need to go back by 4 steps - The first to return to the third Operational goal of the first Strategic goal, then to the second and so on

All data is stored in LocalStorage everytime you go step forward or step back
** Aim is to make it work in Internet Explorer also **
