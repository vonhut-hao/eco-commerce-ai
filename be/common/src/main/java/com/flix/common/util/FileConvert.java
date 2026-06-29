package com.flix.common.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class FileConvert {

    private FileConvert() {
        /* This utility class should not be instantiated */
    }


    public static String serializeFile(List<String> files) {
        if (files == null || files.isEmpty()) {
            return "";
        }
        return String.join(",", files);
    }

    public static List<String> deserializeFile(String file) {
        if (file == null || file.isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.asList(file.split(","));
    }
}
