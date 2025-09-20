document.addEventListener('DOMContentLoaded', function() {

  function toggleEditMode(show) {
    document.getElementById('edit-section').style.display = show ? 'block' : 'none';
  }

  function saveToLocalStorage(data) {
    localStorage.setItem('profileData', JSON.stringify(data));
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem('profileData');
    if (saved) {
      const data = JSON.parse(saved);

      // Apply saved values
      document.querySelector('.hero-text h1').textContent = `Hi, I'm ${data.name}`;
      document.querySelector('#about p').textContent = data.about;
      if (data.picture) {
        document.querySelector('.profile-pic').src = data.picture;
      }

      const hobbyList = document.querySelector('.hobby-list');
      hobbyList.innerHTML = '';
      data.hobbies.forEach(hobby => {
        const div = document.createElement('div');
        div.className = 'hobby';
        div.innerHTML = `<h4>${hobby}</h4>`;
        hobbyList.appendChild(div);
      });

      const skillList = document.querySelector('.skills ul');
      skillList.innerHTML = '';
      data.skills.forEach(skill => {
        const li = document.createElement('li');
        li.textContent = skill;
        skillList.appendChild(li);
      });

      document.querySelector('.contact-info p').textContent = data.contactMsg;
      document.querySelector('.contact-item:nth-child(2) p').textContent = data.email;
      document.querySelector('.contact-item:nth-child(3) p').textContent = data.phone;
      document.querySelector('.contact-item:nth-child(4) p').textContent = data.address;
    }
  }

  // Open editor
  document.getElementById('edit-link').addEventListener('click', function(e) {
    e.preventDefault();
    toggleEditMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Cancel editing
  document.getElementById('edit-cancel').addEventListener('click', function() {
    toggleEditMode(false);
  });

  // Save edits
  document.getElementById('edit-save').addEventListener('click', function() {
    try {
      const name = document.getElementById('edit-name').value;
      const about = document.getElementById('edit-about').value;

      const picInput = document.getElementById('edit-picture');
      const hobbies = document.getElementById('edit-hobbies').value.split(',').map(h => h.trim());
      const skills = document.getElementById('edit-skills').value.split(',').map(s => s.trim());
      const contactMsg = document.getElementById('edit-contact-msg').value;
      const email = document.getElementById('edit-email').value;
      const phone = document.getElementById('edit-phone').value;
      const address = document.getElementById('edit-address').value;

      const data = {
        name,
        about,
        hobbies,
        skills,
        contactMsg,
        email,
        phone,
        address,
        picture: document.querySelector('.profile-pic').src
      };

      function applyUpdates() {
        // Apply changes immediately on page
        document.querySelector('.hero-text h1').textContent = `Hi, I'm ${name}`;
        document.querySelector('#about p').textContent = about;

        const hobbyList = document.querySelector('.hobby-list');
        hobbyList.innerHTML = '';
        hobbies.forEach(hobby => {
          const div = document.createElement('div');
          div.className = 'hobby';
          div.innerHTML = `<h4>${hobby}</h4>`;
          hobbyList.appendChild(div);
        });

        const skillList = document.querySelector('.skills ul');
        skillList.innerHTML = '';
        skills.forEach(skill => {
          const li = document.createElement('li');
          li.textContent = skill;
          skillList.appendChild(li);
        });

        document.querySelector('.contact-info p').textContent = contactMsg;
        document.querySelector('.contact-item:nth-child(2) p').textContent = email;
        document.querySelector('.contact-item:nth-child(3) p').textContent = phone;
        document.querySelector('.contact-item:nth-child(4) p').textContent = address;

        // Save locally
        saveToLocalStorage(data);

        // Send to server
        fetch('/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(result => {
          console.log("Server response:", result.message);
        })
        .catch(err => console.error("Save failed:", err));

        toggleEditMode(false);
        alert('Web page updated successfully');
      }

      // If new picture is selected → upload to server
      if (picInput.files[0]) {
        const formData = new FormData();
        formData.append('file', picInput.files[0]);

        fetch('/upload', {
          method: 'POST',
          body: formData
        })
        .then(res => res.json())
        .then(fileInfo => {
          console.log("Upload successful:", fileInfo);
          // Use server path instead of base64
          data.picture = `/uploads/${fileInfo.filename}`;
          document.querySelector('.profile-pic').src = data.picture;
          applyUpdates();
        })
        .catch(err => {
          console.error("Upload failed:", err);
          alert("Image upload failed");
        });
      } else {
        applyUpdates();
      }

    } catch (err) {
      alert('Update unsuccessful');
      console.error(err);
    }
  });

  // Load saved data on page load
  loadFromLocalStorage();
});
