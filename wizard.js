if(document.querySelector('#wizard-page') !== null) {
    const wizardPageElement = document.querySelector('#wizard-page');
    const ultimateLocalStorageKey = 'ultimate';
    const strategicLocalStorageKey = 'strategic';
    const operationalLocalStorageKey = 'operational';
    let currentStratGoal = 0; // CURRENT STRATEGY GOAL - set it to 0 by default
    let finishButtonSelector = 'finish-button';

    function createUltimateGoalForm(nextForm) {
        if(Boolean(nextForm) === true) setStateFormData(strategicLocalStorageKey, nextForm);
        
        let inputData = '';
        if(Boolean(localStorage.getItem(ultimateLocalStorageKey)) === true) {
            inputData = JSON.parse(localStorage.getItem(ultimateLocalStorageKey))[0];
        }

        clearContentSection();

        let form = createForm('ultimate-goal-form');
        let fieldset = createFieldset();
        let legend = createLegend('Ultimate Goal', fieldset);
        let input = createInputField('createUltimateGoal', inputData, fieldset);
        let nextStepButton = createNextStepButton(fieldset);

        form.appendChild(fieldset);
        wizardPageElement.appendChild(form);

        setClickEventListener('div.next-button-arrow-wrapper', createStrategicGoalForm.bind(this, form, null));
    };

    function createStrategicGoalForm(prevForm, nextForm) {
        if(Boolean(prevForm) === true) setStateFormData(ultimateLocalStorageKey, prevForm);
        if(Boolean(nextForm) === true) setStateFormData(JSON.parse(localStorage.getItem(strategicLocalStorageKey))[currentStratGoal], nextForm, true);

        clearContentSection();

        let inputName = 'createStrategicGoal';
        let addNewGoalClassNameWrapper = 'add-new-strategic-goal-wrapper';
        let addNewGoalClassNameButton = 'add-new-strategic-goal';

        let form = createForm('strategic-goal-form');
        let fieldset = createFieldset();
        let legend = createLegend('Strategic Goal', fieldset);

        let inputData = '';
        if(Boolean(localStorage.getItem(strategicLocalStorageKey)) === true) {
            let inputData = JSON.parse(localStorage.getItem(strategicLocalStorageKey));
            for(let i = 0; i < inputData.length; i++) {
                createInputField(inputName, inputData[i],  fieldset);

                if(i == 0) {
                    createStratOperGoalFormPartial(addNewGoalClassNameWrapper, addNewGoalClassNameButton, fieldset, form);
                }
            }
        } else { // if localStorage is empty
            createInputField(inputName, inputData,  fieldset);
            createStratOperGoalFormPartial(addNewGoalClassNameWrapper, addNewGoalClassNameButton, fieldset, form);

        }

        if(document.querySelector('input[name="' + inputName + '"]').value.length !== 0) createFinishButton(finishButtonSelector, fieldset);

        setClickEventListener('div.next-button-arrow-wrapper', createOperationalGoal.bind(this, form, 'prev'));
        setClickEventListener('div.prev-button-arrow-wrapper', createUltimateGoalForm.bind(this, form));
        setClickEventListener('div.' + addNewGoalClassNameWrapper, createInputField.bind(this, inputName, '', fieldset));
    }

    function createOperationalGoal(paramForm, type, direct) {
        let direction = direct || false;
        let currentStrategyGoal = '';
        

        if(type === 'prev') {
            if(Boolean(paramForm) === true) setStateFormData(strategicLocalStorageKey, paramForm);
        } else if(type === 'self') {
            let appropriateIndexStratGoal;
            if(direction === 'back') currentStratGoalTemp = currentStratGoal + 1;
            if(direction === 'forth') currentStratGoalTemp = currentStratGoal - 1;
            let prevStrategyGoal = JSON.parse(localStorage.getItem(strategicLocalStorageKey))[currentStratGoalTemp];
            console.log(prevStrategyGoal, paramForm);
            setStateFormData(prevStrategyGoal, paramForm, true);
        }

        clearContentSection();

        if(Boolean(localStorage.getItem(strategicLocalStorageKey))) {
            currentStrategyGoal = JSON.parse(localStorage.getItem(strategicLocalStorageKey))[currentStratGoal];
        }

        let inputName = 'createOperationalGoal';
        let addNewGoalClassNameWrapper = 'add-new-operational-goal-wrapper';
        let addNewGoalClassNameButton = 'add-new-operational-goal';

        let form = createForm('operational-goal-form');
        let fieldset = createFieldset();
        let legend = createLegend('Operational Goal', fieldset);

        if(currentStrategyGoal) {
            let stratGoal = drawStratGoal(currentStrategyGoal, fieldset);
        }

        let inputData = '';

        if(Boolean(localStorage.getItem(operationalLocalStorageKey)) === true) {
            
            let operGoals = JSON.parse(localStorage.getItem(operationalLocalStorageKey));
            if(operGoals[currentStrategyGoal]) {
                let inputData = JSON.parse(operGoals[currentStrategyGoal]);
                for(let i = 0; i < inputData.length; i++) {
                    createInputField(inputName, inputData[i],  fieldset);

                    if(i == 0) {
                        createStratOperGoalFormPartial(addNewGoalClassNameWrapper, addNewGoalClassNameButton, fieldset, form);
                    }
                }
            } else {
                createInputField(inputName, inputData,  fieldset);
                createStratOperGoalFormPartial(addNewGoalClassNameWrapper, addNewGoalClassNameButton, fieldset, form);
            }
        } else {
            createInputField(inputName, inputData,  fieldset);
            createStratOperGoalFormPartial(addNewGoalClassNameWrapper, addNewGoalClassNameButton, fieldset, form);
        }
        
        if(document.querySelector('input[name="' + inputName + '"]').value.length !== 0) createFinishButton(finishButtonSelector, fieldset);

        setClickEventListener('div.next-button-arrow-wrapper', toTheNextStratGoal.bind(this, currentStrategyGoal, form)); // in toTheNextStratGoal currentStrategyGoal will be previous currentStrategyGoal
        setClickEventListener('div.prev-button-arrow-wrapper', checkAccessStratGoalForm.bind(this, null, form));
        setClickEventListener('div.' + addNewGoalClassNameWrapper, createInputField.bind(this, inputName, '', fieldset));

    }

    function checkAccessStratGoalForm(mask, oprationalForm) {
        currentStratGoal = currentStratGoal - 1;
        if(currentStratGoal < 0) {
            currentStratGoal = 0;
            createStrategicGoalForm(mask, oprationalForm);
        } else {
            createOperationalGoal(oprationalForm, 'self', 'back');
        }
    }

    function toTheNextStratGoal(localStorageKey, form) {
        currentStratGoal = currentStratGoal + 1;
        if(Boolean(JSON.parse(localStorage.getItem(strategicLocalStorageKey))[currentStratGoal]) === true) {
            setStateFormData(localStorageKey, form, true);
            createOperationalGoal(form, 'self', 'forth');
        } else {
            setStateFormData(localStorageKey, form, true);
            finish();
        }
    }

    function createStratOperGoalFormPartial(classNameWrapper, classNameButton, parent, form) {
            let addNewStrategicGoalButton = createAddNewStratOperGoalButton(classNameWrapper, classNameButton, parent);
            let nextStepButton = createNextStepButton(parent);
            let prevStepButton = createPrevStepButton(parent);
            form.appendChild(parent);
            wizardPageElement.appendChild(form);
    }

    function setStateFormData(localStorageKey, form, stratForm) {
        let strategyForm = stratForm || false;
        let prevFormData = serializeFormData(form);
        console.log(localStorageKey, prevFormData, strategyForm);

        if(strategyForm === true) { // save operational goals
            let operGoals = {};
            if(Boolean(localStorage.getItem(operationalLocalStorageKey)) === true) {
                operGoals = JSON.parse(localStorage.getItem(operationalLocalStorageKey));
            }

            operGoals[localStorageKey] = prevFormData;


            localStorage.setItem(operationalLocalStorageKey, JSON.stringify(operGoals));
        } else {
            localStorage.setItem(localStorageKey, prevFormData);
        }
    }

    function serializeFormData(form) {
        const values = [];
        const inputs = form.elements;

        for (let i = 0; i < inputs.length; i++) {
            if(Boolean(inputs[i].name) === true) {
                values.push(encodeURIComponent(inputs[i].value));
            }
        }

        return JSON.stringify(values);
    }

    function createForm(className) {
        let form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action','');
        form.className = 'wizard-form ' + className;
        return form;
    }

    function createFieldset(parent) {
        let fieldset = document.createElement('fieldset');
        return fieldset;
    }

    function createLegend(subscription, parent) {
        let legend = document.createElement('legend');
        legend.innerHTML = subscription;
        parent.appendChild(legend);
    }

    function createInputField(inputName, inputText, parent) {
        let oldInputText = document.querySelector('.input-text-wrapper:last-of-type');
        
        let inputTextWrapper = document.createElement('p');
        inputTextWrapper.className = 'input-text-wrapper';

        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('name', inputName);
        input.setAttribute('value', decodeURI(inputText));
        inputTextWrapper.appendChild(input);

        if(Boolean(oldInputText) === true) {
            let deleteInputButton = document.createElement('span');
            deleteInputButton.className = 'delete-input';
            inputTextWrapper.appendChild(deleteInputButton);
            insertAfter(inputTextWrapper, oldInputText);

            let deleteInputButtons = document.querySelectorAll('span.delete-input');
            if(deleteInputButtons.length > 0) {
                for(let i = 0; i < deleteInputButtons.length; i++) {
                    deleteInputButtons[i].addEventListener('click', deleteInput);
                }
            }

        } else {
            parent.appendChild(inputTextWrapper);
        }
    }

    function insertAfter(newElement, baseElement) {
        return baseElement.parentNode.insertBefore(newElement, baseElement.nextSibling);
    }

    function createNextStepButton(parent) {
        let nextButtonWrapper = document.createElement('div');
        nextButtonWrapper.className = 'next-button-arrow-wrapper';
        
        let nextButton = document.createElement('div');
        nextButton.className = 'next-button-arrow';
        nextButtonWrapper.appendChild(nextButton);

        parent.appendChild(nextButtonWrapper);
    }

    function createPrevStepButton(parent) {
        let prevButtonWrapper = document.createElement('div');
        prevButtonWrapper.className = 'prev-button-arrow-wrapper';
        
        let prevButton = document.createElement('div');
        prevButton.className = 'prev-button-arrow';
        prevButtonWrapper.appendChild(prevButton);

        parent.appendChild(prevButtonWrapper);
    }

    function createAddNewStratOperGoalButton(classNameWrapper, classNameButton, parent) {
        let addNewStrategicOperGoalButtonWrapper = document.createElement('div');
        addNewStrategicOperGoalButtonWrapper.className = classNameWrapper;

        let addNewStrategicOperGoalButton = document.createElement('div');
        addNewStrategicOperGoalButton.className = classNameButton;
        addNewStrategicOperGoalButtonWrapper.appendChild(addNewStrategicOperGoalButton);
        
        parent.appendChild(addNewStrategicOperGoalButtonWrapper);
    }

    function drawStratGoal(stratGoal, parent) {
        let strategyGoal = document.createElement('p');
        strategyGoal.className = 'current-strategy-goal';
        strategyGoal.innerText = decodeURI(stratGoal);
        parent.appendChild(strategyGoal);
    }

    function finish() {
        console.log(JSON.parse(localStorage.getItem(ultimateLocalStorageKey)));
        console.log(JSON.parse(localStorage.getItem(strategicLocalStorageKey)));
        console.log(JSON.parse(localStorage.getItem(operationalLocalStorageKey)));

        localStorageClear();
        createUltimateGoalForm();
    }

    function deleteInput() {
        this.parentElement.parentElement.removeChild(this.parentElement);
    }

    function clearContentSection() {
        wizardPageElement.innerHTML = '';
    }

    function setClickEventListener(selector, handler) {
        document.querySelector(selector).addEventListener('click', handler);
    }

    window.onbeforeunload = localStorageClear;

    function localStorageClear() {
        localStorage.clear();
    };

    createUltimateGoalForm();
}
