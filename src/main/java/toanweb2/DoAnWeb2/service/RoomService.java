package toanweb2.DoAnWeb2.service;

import toanweb2.DoAnWeb2.entity.Room;

import java.util.List;
import java.util.Optional;

public interface RoomService {
    List<Room> findAll();
    Optional<Room> findById(Long id);
    List<Room> findByStatus(String status);
    Room save(Room room);
    Room update(Long id, Room room);
    void deleteById(Long id);
}
