package org.musicstream.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.musicstream.backend.enums.Category;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrackResponseDTO {

    private String id;
    private String title;
    private String artist;
    private String description;
    private LocalDateTime addedDate;
    private Integer duration;
    private Category category;
    private byte[] fileData;
    private String coverImage;
}