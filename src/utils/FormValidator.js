export default class FormValidator {
  constructor(formElement, configForm) {
    this._formElement = formElement;
    this._configForm = configForm;
  }

  _showInputError = (formElement, inputElement, errorMessage, configForm) => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.add(configForm.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(configForm.errorClass);
  };

  _hideInputError = (formElement, inputElement, configForm) => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.remove(configForm.inputErrorClass);
    errorElement.classList.remove(configForm.errorClass);
    errorElement.textContent = "";
  };

  _checkInputValidity = (formElement, inputElement, configForm) => {
    if (!inputElement.validity.valid) {
      this._showInputError(
        formElement,
        inputElement,
        inputElement.validationMessage,
        configForm
      );
    } else {
      this._hideInputError(formElement, inputElement, configForm);
    }
  };

  _hasInvalidInput = (inputList) => {
    return inputList.some((inputElement) => {
      return !inputElement.validity.valid;
    });
  };

  _toggleButtonState = (inputList, buttonElement, configForm) => {
    if (this._hasInvalidInput(inputList)) {
      buttonElement.classList.add(configForm.inactiveButtonClass);
      buttonElement.disabled = true;
    } else {
      buttonElement.classList.remove(configForm.inactiveButtonClass);
      buttonElement.disabled = false;
    }
  };

  _setEventListeners = (formElement, configForm) => {
    const inputList = Array.from(
      formElement.querySelectorAll(configForm.inputSelector)
    );
    const buttonElement = formElement.querySelector(
      configForm.submitButtonSelector
    );

    this._toggleButtonState(inputList, buttonElement, configForm);
    inputList.forEach((inputElement) => {
      inputElement.addEventListener("input", () => {
        this._checkInputValidity(formElement, inputElement, configForm);
        this._toggleButtonState(inputList, buttonElement, configForm);
      });
    });
  };

  enableValidation = () => {
    this._formElement.addEventListener("submit", function (evt) {
      evt.preventDefault();
    });
    this._setEventListeners(this._formElement, this._configForm);
  };
}
