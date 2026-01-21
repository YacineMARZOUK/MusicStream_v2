package org.musicstream.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.musicstream.backend.dto.request.TrackRequestDTO;
import org.musicstream.backend.dto.response.TrackResponseDTO;
import org.musicstream.backend.dto.response.TrackResponseLightDTO;
import org.musicstream.backend.enums.Category;
import org.musicstream.backend.service.TrackService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tracks")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Track Management", description = "APIs for managing music tracks")
public class TrackController {

    private final TrackService trackService;

    /**
     * GET /api/tracks - Récupérer tous les tracks
     */
    @GetMapping
    @Operation(summary = "Get all tracks", description = "Retrieve all tracks (light version)")
    public ResponseEntity<List<TrackResponseLightDTO>> getAllTracks() {
        log.info("GET /api/tracks - Fetching all tracks");
        List<TrackResponseLightDTO> tracks = trackService.getAllTracks();
        return ResponseEntity.ok(tracks);
    }

    /**
     * GET /api/tracks/{id} - Récupérer un track par ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get track by ID", description = "Retrieve a specific track")
    public ResponseEntity<TrackResponseDTO> getTrackById(
            @Parameter(description = "Track ID") @PathVariable String id) {
        log.info("GET /api/tracks/{} - Fetching track by id", id);
        TrackResponseDTO track = trackService.getTrackById(id);
        return ResponseEntity.ok(track);
    }

    /**
     * POST /api/tracks - Ajouter un nouveau track
     */
    @PostMapping
    @Operation(summary = "Add new track", description = "Create a new track")
    public ResponseEntity<TrackResponseDTO> addTrack(
            @Valid @RequestBody TrackRequestDTO trackRequestDTO) {
        log.info("POST /api/tracks - Adding new track: {}", trackRequestDTO.getTitle());
        TrackResponseDTO createdTrack = trackService.addTrack(trackRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTrack);
    }

    /**
     * PUT /api/tracks/{id} - Mettre à jour un track
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update track", description = "Update an existing track")
    public ResponseEntity<TrackResponseDTO> updateTrack(
            @Parameter(description = "Track ID") @PathVariable String id,
            @Valid @RequestBody TrackRequestDTO trackRequestDTO) {
        log.info("PUT /api/tracks/{} - Updating track", id);
        TrackResponseDTO updatedTrack = trackService.updateTrack(id, trackRequestDTO);
        return ResponseEntity.ok(updatedTrack);
    }

    /**
     * DELETE /api/tracks/{id} - Supprimer un track
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete track", description = "Delete a track by ID")
    public ResponseEntity<Void> deleteTrack(
            @Parameter(description = "Track ID") @PathVariable String id) {
        log.info("DELETE /api/tracks/{} - Deleting track", id);
        trackService.deleteTrack(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/tracks/search?query={query} - Rechercher
     */
    @GetMapping("/search")
    @Operation(summary = "Search tracks", description = "Search by title or artist")
    public ResponseEntity<List<TrackResponseLightDTO>> searchTracks(
            @Parameter(description = "Search query") @RequestParam String query) {
        log.info("GET /api/tracks/search?query={}", query);
        List<TrackResponseLightDTO> tracks = trackService.searchTracks(query);
        return ResponseEntity.ok(tracks);
    }

    /**
     * GET /api/tracks/category/{category} - Filtrer par catégorie
     */
    @GetMapping("/category/{category}")
    @Operation(summary = "Get by category", description = "Filter tracks by category")
    public ResponseEntity<List<TrackResponseLightDTO>> getTracksByCategory(
            @Parameter(description = "Category") @PathVariable Category category) {
        log.info("GET /api/tracks/category/{}", category);
        List<TrackResponseLightDTO> tracks = trackService.getTracksByCategory(category);
        return ResponseEntity.ok(tracks);
    }

    /**
     * GET /api/tracks/filter - Recherche combinée
     */
    @GetMapping("/filter")
    @Operation(summary = "Filter tracks", description = "Search with filters")
    public ResponseEntity<List<TrackResponseLightDTO>> filterTracks(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Category category) {
        log.info("GET /api/tracks/filter?query={}&category={}", query, category);
        List<TrackResponseLightDTO> tracks = trackService.searchTracksWithFilter(query, category);
        return ResponseEntity.ok(tracks);
    }
}
