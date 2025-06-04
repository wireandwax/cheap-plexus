{
    var comp = app.project.activeItem;

    if (!(comp instanceof CompItem)) {
        alert("Choose a Comp !");
    } else {
        app.beginUndoGroup("Cheap Plexus");

        var numPoints = 50;
        var maxDistance = 200;
        var dotRadius = 5;
        var dotColour = [1, 1, 1]; // White
        var lineColour = [1, 1, 1]; // White
        var lineWidth = 1;

        var points = [];

        // Add Dots etc
        for (var i = 0; i < numPoints; i++) {
            var x = Math.random() * comp.width;
            var y = Math.random() * comp.height;
            points.push([x, y]);

            var dot = comp.layers.addShape();
            dot.name = "Dot_" + i;

            var contents = dot.property("ADBE Root Vectors Group");
            var circle = contents.addProperty("ADBE Vector Shape - Ellipse");
            circle.property("ADBE Vector Ellipse Size").setValue([dotRadius * 2, dotRadius * 2]);

            var fill = contents.addProperty("ADBE Vector Graphic - Fill");
            fill.property("ADBE Vector Fill Color").setValue(dotColour);

            dot.property("Transform").property("Position").setValue([x, y]);
        }

        // Connect dots & lines
        for (var i = 0; i < numPoints; i++) {
            for (var j = i + 1; j < numPoints; j++) {
                var p1 = points[i];
                var p2 = points[j];
                var dx = p2[0] - p1[0];
                var dy = p2[1] - p1[1];
                var dist = Math.sqrt(dx * dx + dy * dy);

                if (dist <= maxDistance) {
                    var midX = (p1[0] + p2[0]) / 2;
                    var midY = (p1[1] + p2[1]) / 2;

                    var line = comp.layers.addShape();
                    line.name = "Line_" + i + "_" + j;

                    var contents = line.property("ADBE Root Vectors Group");
                    var pathGroup = contents.addProperty("ADBE Vector Shape - Group");
                    var pathProp = pathGroup.property("ADBE Vector Shape");

                    var shape = new Shape();
                    shape.vertices = [
                        [-(dx / 2), -(dy / 2)],
                        [(dx / 2), (dy / 2)]
                    ];
                    shape.closed = false;
                    pathProp.setValue(shape);

                    var stroke = contents.addProperty("ADBE Vector Graphic - Stroke");
                    stroke.property("ADBE Vector Stroke Color").setValue(lineColour);
                    stroke.property("ADBE Vector Stroke Width").setValue(lineWidth);

                    // Sort Line Pos
                    line.property("Transform").property("Position").setValue([midX, midY]);

                    
                    line.moveToBeginning();
                }
            }
        }

        app.endUndoGroup();
    }
}
