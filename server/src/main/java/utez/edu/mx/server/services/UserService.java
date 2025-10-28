package utez.edu.mx.server.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import utez.edu.mx.server.models.User;
import utez.edu.mx.server.repositories.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository repository;

    public List<User> getAll() {
        return repository.findAll();
    }

    public User save(User user) {
        return repository.save(user);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public User update(Long id, User user) {
        Optional<User> opt = repository.findById(id);
        if (opt.isPresent()) {
            User existing = opt.get();
            existing.setName(user.getName());
            existing.setEmail(user.getEmail());
            existing.setPhone(user.getPhone());
            return repository.save(existing);
        }
        throw new IllegalArgumentException("User with id " + id + " not found");
    }
}
