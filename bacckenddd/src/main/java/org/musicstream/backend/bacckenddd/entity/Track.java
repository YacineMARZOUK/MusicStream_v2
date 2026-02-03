package org.musicstream.backend.bacckenddd.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.musicstream.backend.bacckenddd.enums.Category;

import java.sql.Types;
import java.time.LocalDateTime;

@Entity
@Table(name = "tracks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Track {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String artist;

    @Column(length = 1000)
    private String description;

    @CreationTimestamp
    @Column(name = "added_date", nullable = false, updatable = false)
    private LocalDateTime addedDate;

    @Column(nullable = false)
    private Integer duration; // Durée en secondes

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Lob // Indique que c'est un objet large
    @JdbcTypeCode(Types.VARBINARY)    @Column(name = "file_data", nullable = false, columnDefinition = "BYTEA")
    private byte[] fileData;

    @Column(name = "cover_image", length = 500)
    private String coverImage;


}