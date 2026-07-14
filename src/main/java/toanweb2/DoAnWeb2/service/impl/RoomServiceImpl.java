package toanweb2.DoAnWeb2.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import toanweb2.DoAnWeb2.entity.Room;
import toanweb2.DoAnWeb2.repository.RoomRepository;
import toanweb2.DoAnWeb2.service.RoomService;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;

    @Override
    public List<Room> findAll() {
        return roomRepository.findAll();
    }

    @Override
    public Optional<Room> findById(Long id) {
        return roomRepository.findById(id);
    }

    @Override
    public List<Room> findByStatus(String status) {
        return roomRepository.findByStatus(status);
    }

    @Override
    public Room save(Room room) {
        return roomRepository.save(room);
    }

    @Override
    public Room update(Long id, Room room) {
        Room existing = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng với ID: " + id));
        existing.setRoomName(room.getRoomName());
        existing.setDescription(room.getDescription());
        existing.setImage(room.getImage());
        existing.setStatus(room.getStatus());
        return roomRepository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        roomRepository.deleteById(id);
    }
}
