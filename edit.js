
document.addEventListener('DOMContentLoaded', function() {

  function toggleEditMode(show) {
    document.getElementById('edit-section').style.display = show ? 'block' : 'none';
  }

  document.getElementById('edit-link').addEventListener('click', function(e) {
    e.preventDefault();
    toggleEditMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.getElementById('edit-cancel').addEventListener('click', function() {
    toggleEditMode(false);
  });

  document.getElementById('edit-save').addEventListener('click', function() {
    try {
      var name = document.getElementById('edit-name').value;
      document.querySelector('.hero-text h1').textContent = `Hi, I'm ${name}`;
    
      var about = document.getElementById('edit-about').value;
      document.querySelector('#about p').textContent = about;
      
      var picInput = document.getElementById('edit-picture');
      if (picInput.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
          document.querySelector('.profile-pic').src = e.target.result;
        };
        reader.readAsDataURL(picInput.files[0]);
      }
      
      var hobbies = document.getElementById('edit-hobbies').value.split(',');
      var hobbyList = document.querySelector('.hobby-list');
      hobbyList.innerHTML = '';
      hobbies.forEach(function(hobby) {
        var div = document.createElement('div');
        div.className = 'hobby';
        div.innerHTML = `<h4>${hobby.trim()}</h4>`;
        hobbyList.appendChild(div);
      });
      
      var skills = document.getElementById('edit-skills').value.split(',');
      var skillList = document.querySelector('.skills ul');
      skillList.innerHTML = '';
      skills.forEach(function(skill) {
        var li = document.createElement('li');
        li.textContent = skill.trim();
        skillList.appendChild(li);
      });
      // Contact
      document.querySelector('.contact-info p').textContent = document.getElementById('edit-contact-msg').value;
      document.querySelector('.contact-item:nth-child(2) p').textContent = document.getElementById('edit-email').value;
      document.querySelector('.contact-item:nth-child(3) p').textContent = document.getElementById('edit-phone').value;
      document.querySelector('.contact-item:nth-child(4) p').textContent = document.getElementById('edit-address').value;
      toggleEditMode(false);
      alert('Web page updated successfully');
    } catch (err) {
      alert('Update unsuccessful');
    }
  });
});
