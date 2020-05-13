package <%= packageName %>;

import java.util.Date;

public class ExceptionResponse {

	private Date timestamp;
	private String mensajes;
	private String detalles;
	
	public ExceptionResponse(Date timestamp, String mensajes, String detalles) {
		this.timestamp = timestamp;
		this.mensajes = mensajes;
		this.detalles = detalles;
	}
	
	public Date getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}
	public String getMensajes() {
		return mensajes;
	}
	public void setMensajes(String mensajes) {
		this.mensajes = mensajes;
	}
	public String getDetalles() {
		return detalles;
	}
	public void setDetalles(String detalles) {
		this.detalles = detalles;
	}

}


