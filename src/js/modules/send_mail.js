

export const formSetting = () => {

    const emailForm = document.querySelector('#form-email');
    const email = document.getElementById('email');
    const name = document.getElementById('name');
    const message = document.getElementById('message');

    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = {
            email: email.value,
            name: name.value,
            message: message.value,
        }

        console.log(formData);

        fetch('/', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((res) => res.json())

            .then((res) => {
                console.log('Success:', res);
            })
            .catch((error) => {
                console.log('Error:', error);
            });


        // let xhr = new XMLHttpRequest();
        // xhr.open('POST', '/');
        // xhr.setRequestHeader('content-type', 'application/json');
        // xhr.onload = function () {
        //     console.log(xhr.responseText);
        //     if (xhr.responseText == 'success') {
        //         alert('email sent');
        //         email.value = '';
        //         name.value = '';
        //         message.value = '';
        //     } else {
        //         alert('somthing went wrong');
        //     }
        // }
        // xhr.send(JSON.stringify(formData));
    });
} 