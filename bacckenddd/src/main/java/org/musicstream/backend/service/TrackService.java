package org.musicstream.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.musicstream.backend.dto.request.TrackRequestDTO;
import org.musicstream.backend.dto.response.TrackResponseDTO;
import org.musicstream.backend.dto.response.TrackResponseLightDTO;
import org.musicstream.backend.entity.Track;
import org.musicstream.backend.enums.Category;
import org.musicstream.backend.exception.ResourceNotFoundException;
import org.musicstream.backend.repository.TrackRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TrackService {

    private final TrackRepository trackRepository;
    private final ModelMapper modelMapper;

    /**
     * Récupérer tous les tracks (version légère sans fileData)
     */
    @Transactional(readOnly = true)
    public List<TrackResponseLightDTO> getAllTracks() {
        log.info("Fetching all tracks");
        List<Track> tracks = trackRepository.findAll();

        return tracks.stream()
                .map(track -> modelMapper.map(track, TrackResponseLightDTO.class))
                .collect(Collectors.toList());
    }

    /**
     * Récupérer un track par ID (avec fileData)
     */
    @Transactional(readOnly = true)
    public TrackResponseDTO getTrackById(String id) {
        log.info("Fetching track with id: {}", id);
        Track track = trackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Track", "id", id));

        return modelMapper.map(track, TrackResponseDTO.class);
    }

    /**
     * Ajouter un nouveau track
     */
    public TrackResponseDTO addTrack(TrackRequestDTO trackRequestDTO) {
        log.info("Adding new track: {}", trackRequestDTO.getTitle());

        Track track = modelMapper.map(trackRequestDTO, Track.class);
        Track savedTrack = trackRepository.save(track);

        log.info("Track saved successfully with id: {}", savedTrack.getId());
        return modelMapper.map(savedTrack, TrackResponseDTO.class);
    }

    /**
     * Mettre à jour un track existant
     */
    public TrackResponseDTO updateTrack(String id, TrackRequestDTO trackRequestDTO) {
        log.info("Updating track with id: {}", id);

        Track existingTrack = trackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Track", "id", id));

        // Mise à jour des champs
        existingTrack.setTitle(trackRequestDTO.getTitle());
        existingTrack.setArtist(trackRequestDTO.getArtist());
        existingTrack.setDescription(trackRequestDTO.getDescription());
        existingTrack.setDuration(trackRequestDTO.getDuration());
        existingTrack.setCategory(trackRequestDTO.getCategory());
        existingTrack.setFileData(trackRequestDTO.getFileData());
        existingTrack.setCoverImage(trackRequestDTO.getCoverImage());

        Track updatedTrack = trackRepository.save(existingTrack);

        log.info("Track updated successfully with id: {}", updatedTrack.getId());
        return modelMapper.map(updatedTrack, TrackResponseDTO.class);
    }

    /**
     * Supprimer un track
     */
    public void deleteTrack(String id) {
        log.info("Deleting track with id: {}", id);

        Track track = trackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Track", "id", id));

        trackRepository.delete(track);
        log.info("Track deleted successfully with id: {}", id);
    }

    /**
     * Rechercher des tracks par titre ou artiste
     */
    @Transactional(readOnly = true)
    public List<TrackResponseLightDTO> searchTracks(String query) {
        log.info("Searching tracks with query: {}", query);

        List<Track> tracks = trackRepository.searchTracks(query);

        return tracks.stream()
                .map(track -> modelMapper.map(track, TrackResponseLightDTO.class))
                .collect(Collectors.toList());
    }

    /**
     * Filtrer les tracks par catégorie
     */
    @Transactional(readOnly = true)
    public List<TrackResponseLightDTO> getTracksByCategory(Category category) {
        log.info("Fetching tracks by category: {}", category);

        List<Track> tracks = trackRepository.findByCategory(category);

        return tracks.stream()
                .map(track -> modelMapper.map(track, TrackResponseLightDTO.class))
                .collect(Collectors.toList());
    }

    /**
     * Recherche combinée : par query et catégorie
     */
    @Transactional(readOnly = true)
    public List<TrackResponseLightDTO> searchTracksWithFilter(String query, Category category) {
        log.info("Searching tracks with query: {} and category: {}", query, category);

        List<Track> tracks;

        if (query != null && !query.isEmpty() && category != null) {
            tracks = trackRepository.searchTracksWithCategory(query, category);
        } else if (query != null && !query.isEmpty()) {
            tracks = trackRepository.searchTracks(query);
        } else if (category != null) {
            tracks = trackRepository.findByCategory(category);
        } else {
            tracks = trackRepository.findAll();
        }

        return tracks.stream()
                .map(track -> modelMapper.map(track, TrackResponseLightDTO.class))
                .collect(Collectors.toList());
    }
}