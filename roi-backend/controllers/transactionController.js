const Property = require('../models/Property');
const Transaction = require('../models/Transaction');
const fs = require("fs");
const path = require('path');

const registerTransaction = async (req, res) => {
    try {
        const propertyId = req.params.id;
        const { deal, amount, commission, date } = req.body;

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: "Propiedad no encontrada" });
        }
        if (property.fk_advisor.toString() !== req.user.id) {
            return res.status(403).json({ message: "No tienes permiso para registrar una transacción para esta propiedad" });
        }
        if (property.status !== "Disponible") {
            return res.status(403).json({ message: "La propiedad no se encuentra disponible" });
        }

         const transaction = new Transaction({
            fk_property: propertyId,
            fk_advisor: req.user.id,
            deal,
            amount,
            commission,
            date,
            documents: []
        });
        await transaction.save();

        property.status = "No Disponible";
        await property.save();

        res.status(201).json({ message: "Transacción registrada exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar la transacción", error });
    }
};

const getTransaction = async (req, res) => {
    try {
        const transactionId = req.params.id;
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: "Transacción no encontrada" });
        }
        res.json({ transaction });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la transacción", error });
    }
}

const deleteTransaction = async (req, res) => {
    try {
        const transactionId = req.params.id;
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: "Transacción no encontrada" });
        }
        if (transaction.fk_advisor.toString() !== req.user.id) {
            return res.status(403).json({ message: "No tienes permiso para eliminar esta transacción" });
        }

        transaction.documents.forEach((doc) => {
            const documentPath = path.join(__dirname, '..', 'uploads', 'transaction_files', doc.filename);
            fs.unlink(documentPath, (err) => {
                if (err) {
                    console.error("Error al eliminar el documento: ", err);
                }
            });
        });

        const property = await Property.findById(transaction.fk_property);
        property.status = "Disponible";

        await property.save();
        await Transaction.findByIdAndDelete(transactionId);

        res.status(200).json({ message: "Transacción eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la transacción", error });
    }
};

const updateTransaction = async (req, res) => {
    try {
        const transactionId = req.params.id;
        const { deal, amount, commission, date } = req.body;

        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: "Transacción no encontrada" });
        }
        if (transaction.fk_advisor.toString() !== req.user.id) {
            return res.status(403).json({ message: "No tienes permiso para editar esta transacción" });
        }
        const updatedTransaction = await Transaction.findByIdAndUpdate(transactionId, { deal, amount, commission, date }, { new: true });

        res.status(200).json({ message: "Transacción actualizada exitosamente", updatedTransaction });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la transacción", error });
    }
};

const uploadDocument = async (req, res) => {
    try {
        const transactionId = req.params.id;
        const { name } = req.body;

        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: "Transacción no encontrada" });
        }
        if (transaction.fk_advisor.toString() !== req.user.id) {
            return res.status(403).json({ message: "No tienes permiso para agregar documentos a esta transacción" });
        }
        if (transaction.documents.length >= 12) {
            return res.status(400).json({ message: "Se ha alcanzado el límite de 12 documentos por transacción" });
        }
        if (!req.file) {
            return res.status(400).json({ message: "Debe proporcionar un archivo PDF" });
        }
        const newDocument = {
            name,
            filename: req.file.filename,
        };
        transaction.documents.push(newDocument);
        await transaction.save();

        res.status(200).json({ message: "El documento se guardó exitosamente" });
    } catch (error) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ message: "El tamaño del archivo excede el límite de 25 MB" });
        }
        res.status(500).json({ message: "Error al subir el documento", error });
    }
};

const deleteDocument = async (req, res) => {
    try {
        const { transactionId, filename } = req.params;

        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: "Transacción no encontrada" });
        }
        if (transaction.fk_advisor.toString() !== req.user.id) {
            return res.status(403).json({ message: "No tienes permiso para eliminar documentos de esta transacción" });
        }

        const documentIndex = transaction.documents.findIndex((doc) => doc.filename === filename);
        if (documentIndex === -1) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        const [document] = transaction.documents.splice(documentIndex, 1);


        const documentPath = path.join(__dirname, '..', 'uploads', 'transaction_files', document.filename);
        fs.unlink(documentPath, (err) => {
            if (err) {
                console.error("Error al eliminar el documento: ", err);
            }
        });

        await transaction.save();

        res.status(200).json({ message: "Documento eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el documento", error });
    }
};

module.exports = { registerTransaction, getTransaction, deleteTransaction, updateTransaction, uploadDocument, deleteDocument };