package org.musicstream.backend.bacckenddd.dto.request;
import jakarta.validation.constraints.NotBlank;

public record SongRequestDTO{
        @NotBlank(message = "Le titre est obligatoire")
        String title,
        @NotBlank(message = "L'artiste est obligatoire")
        String artist,
        String album,
        String duration,
        String songUrl,
        String coverUrl
}